import * as assert from "assert";
const LOG_START_INDEX = "Program log: ".length;
export class EventManager {
    constructor(programId, provider, coder) {
        this._programId = programId;
        this._provider = provider;
        this._eventParser = new EventParser(programId, coder);
        this._eventCallbacks = new Map();
        this._eventListeners = new Map();
        this._listenerIdCount = 0;
    }
    addEventListener(eventName, callback) {
        let listener = this._listenerIdCount;
        this._listenerIdCount += 1;
        // Store the listener into the event map.
        if (!(eventName in this._eventCallbacks)) {
            this._eventListeners.set(eventName, []);
        }
        this._eventListeners.set(eventName, this._eventListeners.get(eventName).concat(listener));
        // Store the callback into the listener map.
        this._eventCallbacks.set(listener, [eventName, callback]);
        // Create the subscription singleton, if needed.
        if (this._onLogsSubscriptionId !== undefined) {
            return;
        }
        this._onLogsSubscriptionId = this._provider.connection.onLogs(this._programId, (logs, ctx) => {
            if (logs.err) {
                console.error(logs);
                return;
            }
            this._eventParser.parseLogs(logs.logs, (event) => {
                const allListeners = this._eventListeners.get(eventName);
                if (allListeners) {
                    allListeners.forEach((listener) => {
                        const [, callback] = this._eventCallbacks.get(listener);
                        callback(event.data, ctx.slot);
                    });
                }
            });
        });
        return listener;
    }
    async removeEventListener(listener) {
        // Get the callback.
        const callback = this._eventCallbacks.get(listener);
        if (!callback) {
            throw new Error(`Event listener ${listener} doesn't exist!`);
        }
        const [eventName] = callback;
        // Get the listeners.
        let listeners = this._eventListeners.get(eventName);
        if (!listeners) {
            throw new Error(`Event listeners dont' exist for ${eventName}!`);
        }
        // Update both maps.
        this._eventCallbacks.delete(listener);
        listeners = listeners.filter((l) => l !== listener);
        if (listeners.length === 0) {
            this._eventListeners.delete(eventName);
        }
        // Kill the websocket connection if all listeners have been removed.
        if (this._eventCallbacks.size == 0) {
            assert.ok(this._eventListeners.size === 0);
            await this._provider.connection.removeOnLogsListener(this._onLogsSubscriptionId);
            this._onLogsSubscriptionId = undefined;
        }
    }
}
export class EventParser {
    constructor(programId, coder) {
        this.coder = coder;
        this.programId = programId;
    }
    // Each log given, represents an array of messages emitted by
    // a single transaction, which can execute many different programs across
    // CPI boundaries. However, the subscription is only interested in the
    // events emitted by *this* program. In achieving this, we keep track of the
    // program execution context by parsing each log and looking for a CPI
    // `invoke` call. If one exists, we know a new program is executing. So we
    // push the programId onto a stack and switch the program context. This
    // allows us to track, for a given log, which program was executing during
    // its emission, thereby allowing us to know if a given log event was
    // emitted by *this* program. If it was, then we parse the raw string and
    // emit the event if the string matches the event being subscribed to.
    parseLogs(logs, callback) {
        const logScanner = new LogScanner(logs);
        const execution = new ExecutionContext(logScanner.next());
        let log = logScanner.next();
        while (log !== null) {
            let [event, newProgram, didPop] = this.handleLog(execution, log);
            if (event) {
                callback(event);
            }
            if (newProgram) {
                execution.push(newProgram);
            }
            if (didPop) {
                execution.pop();
            }
            log = logScanner.next();
        }
    }
    // Main log handler. Returns a three element array of the event, the
    // next program that was invoked for CPI, and a boolean indicating if
    // a program has completed execution (and thus should be popped off the
    // execution stack).
    handleLog(execution, log) {
        // Executing program is this program.
        if (execution.stack.length > 0 &&
            execution.program() === this.programId.toString()) {
            return this.handleProgramLog(log);
        }
        // Executing program is not this program.
        else {
            return [null, ...this.handleSystemLog(log)];
        }
    }
    // Handles logs from *this* program.
    handleProgramLog(log) {
        // This is a `msg!` log.
        if (log.startsWith("Program log:")) {
            const logStr = log.slice(LOG_START_INDEX);
            const event = this.coder.events.decode(logStr);
            return [event, null, false];
        }
        // System log.
        else {
            return [null, ...this.handleSystemLog(log)];
        }
    }
    // Handles logs when the current program being executing is *not* this.
    handleSystemLog(log) {
        // System component.
        const logStart = log.split(":")[0];
        // Did the program finish executing?
        if (logStart.match(/^Program (.*) success/g) !== null) {
            return [null, true];
            // Recursive call.
        }
        else if (logStart.startsWith(`Program ${this.programId.toString()} invoke`)) {
            return [this.programId.toString(), false];
        }
        // CPI call.
        else if (logStart.includes("invoke")) {
            return ["cpi", false]; // Any string will do.
        }
        else {
            return [null, false];
        }
    }
}
// Stack frame execution context, allowing one to track what program is
// executing for a given log.
class ExecutionContext {
    constructor(log) {
        // Assumes the first log in every transaction is an `invoke` log from the
        // runtime.
        const program = /^Program (.*) invoke.*$/g.exec(log)[1];
        this.stack = [program];
    }
    program() {
        assert.ok(this.stack.length > 0);
        return this.stack[this.stack.length - 1];
    }
    push(newProgram) {
        this.stack.push(newProgram);
    }
    pop() {
        assert.ok(this.stack.length > 0);
        this.stack.pop();
    }
}
class LogScanner {
    constructor(logs) {
        this.logs = logs;
    }
    next() {
        if (this.logs.length === 0) {
            return null;
        }
        let l = this.logs[0];
        this.logs = this.logs.slice(1);
        return l;
    }
}
//# sourceMappingURL=event.js.map