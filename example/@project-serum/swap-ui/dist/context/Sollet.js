"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapApiError = exports.swapApiRequest = exports.requestWormholeSwapMarketIfNeeded = exports.fetchSolletInfo = exports.useSolletInfo = void 0;
var react_async_hook_1 = require("react-async-hook");
var web3_js_1 = require("@solana/web3.js");
function useSolletInfo(mint) {
    var _this = this;
    return react_async_hook_1.useAsync(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, fetchSolletInfo(mint)];
        });
    }); }, [mint]);
}
exports.useSolletInfo = useSolletInfo;
// Fetches the token info from the sollet bridge.
function fetchSolletInfo(mint) {
    return __awaiter(this, void 0, void 0, function () {
        var info, infoRaw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    info = _SOLLET_INFO_CACHE.get(mint.toString());
                    if (info !== undefined) {
                        return [2 /*return*/, info];
                    }
                    return [4 /*yield*/, swapApiRequest("GET", "coins/sol/" + mint.toString())];
                case 1:
                    infoRaw = _a.sent();
                    info = __assign(__assign({}, infoRaw), { splMint: new web3_js_1.PublicKey(infoRaw.splMint) });
                    _SOLLET_INFO_CACHE.set(mint.toString(), info);
                    return [2 /*return*/, info];
            }
        });
    });
}
exports.fetchSolletInfo = fetchSolletInfo;
// Requests the creation of a sollet wormhole swap market, if it doesn't
// already exist. Note: this triggers a creation notification. Creation
// doesn't happen immediately, but at some unspecified point in the future
// since market makers need to setup on the swap market and provide liquidity.
//
// Returns true if the market exists already. False otherwise.
function requestWormholeSwapMarketIfNeeded(connection, solletMint, wormholeMint, swapMarket, solletInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, acc, resource;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cached = _SWAP_MARKET_EXISTS_CACHE.get(swapMarket.toString());
                    if (cached !== undefined) {
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, connection.getAccountInfo(swapMarket)];
                case 1:
                    acc = _a.sent();
                    if (acc === null) {
                        _SWAP_MARKET_EXISTS_CACHE.set(swapMarket.toString(), false);
                        resource = "wormhole/pool/" + solletInfo.ticker + "/" + swapMarket.toString() + "/" + solletMint.toString() + "/" + wormholeMint.toString();
                        swapApiRequest("POST", resource).catch(console.error);
                        return [2 /*return*/, false];
                    }
                    else {
                        _SWAP_MARKET_EXISTS_CACHE.set(swapMarket.toString(), true);
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.requestWormholeSwapMarketIfNeeded = requestWormholeSwapMarketIfNeeded;
function swapApiRequest(method, path, body) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, params, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = {};
                    params = { headers: headers, method: method };
                    if (method === "GET") {
                        params.cache = "no-cache";
                    }
                    else if (body) {
                        headers["Content-Type"] = "application/json";
                        params.body = JSON.stringify(body);
                    }
                    return [4 /*yield*/, fetch("https://swap.sollet.io/api/" + path, params)];
                case 1:
                    resp = _a.sent();
                    return [4 /*yield*/, handleSwapApiResponse(resp)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.swapApiRequest = swapApiRequest;
function handleSwapApiResponse(resp) {
    return __awaiter(this, void 0, void 0, function () {
        var json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resp.json()];
                case 1:
                    json = _a.sent();
                    if (!json.success) {
                        throw new SwapApiError(json.error, resp.status);
                    }
                    return [2 /*return*/, json.result];
            }
        });
    });
}
var SwapApiError = /** @class */ (function (_super) {
    __extends(SwapApiError, _super);
    function SwapApiError(msg, status) {
        var _this = _super.call(this, msg) || this;
        _this.name = "SwapApiError";
        _this.status = status;
        return _this;
    }
    return SwapApiError;
}(Error));
exports.SwapApiError = SwapApiError;
var _SOLLET_INFO_CACHE = new Map();
var _SWAP_MARKET_EXISTS_CACHE = new Map();
