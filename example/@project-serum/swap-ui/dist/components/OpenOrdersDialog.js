"use strict";
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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var web3_js_1 = require("@solana/web3.js");
var core_1 = require("@material-ui/core");
var icons_1 = require("@material-ui/icons");
var Dex_1 = require("../context/Dex");
var TokenList_1 = require("../context/TokenList");
var Token_1 = require("../context/Token");
var pubkeys_1 = require("../utils/pubkeys");
var useStyles = core_1.makeStyles(function (theme) { return ({
    table: {},
    closeAccount: {
        color: theme.palette.error.main,
    },
}); });
function OpenOrdersDialog(_a) {
    var open = _a.open, onClose = _a.onClose;
    return (jsx_runtime_1.jsxs(core_1.Dialog, __assign({ maxWidth: "lg", open: open, onClose: onClose, PaperProps: {
            style: {
                borderRadius: "10px",
            },
        } }, { children: [jsx_runtime_1.jsx("div", __assign({ style: {
                    display: "flex",
                    justifyContent: "flex-end",
                } }, { children: jsx_runtime_1.jsx(core_1.IconButton, __assign({ onClick: onClose, style: {
                        padding: 10,
                    } }, { children: jsx_runtime_1.jsx(icons_1.Close, {}, void 0) }), void 0) }), void 0),
            jsx_runtime_1.jsx(core_1.DialogContent, __assign({ style: { paddingTop: 0 } }, { children: jsx_runtime_1.jsx(OpenOrdersAccounts, {}, void 0) }), void 0)] }), void 0));
}
exports.default = OpenOrdersDialog;
function OpenOrdersAccounts() {
    var styles = useStyles();
    var openOrders = Dex_1.useOpenOrders();
    var openOrdersEntries = react_1.useMemo(function () {
        return Array.from(openOrders.entries()).map(function (_a) {
            var market = _a[0], oo = _a[1];
            return [
                new web3_js_1.PublicKey(market),
                oo,
            ];
        });
    }, [openOrders]);
    return (jsx_runtime_1.jsx(core_1.TableContainer, __assign({ component: core_1.Paper, elevation: 0 }, { children: jsx_runtime_1.jsxs(core_1.Table, __assign({ className: styles.table, "aria-label": "simple table" }, { children: [jsx_runtime_1.jsx(core_1.TableHead, { children: jsx_runtime_1.jsxs(core_1.TableRow, { children: [jsx_runtime_1.jsx(core_1.TableCell, { children: "Market" }, void 0),
                            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: "Open Orders Account" }), void 0),
                            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: "Base Used" }), void 0),
                            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: "Base Free" }), void 0),
                            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: "Quote Used" }), void 0),
                            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: "Quote Free" }), void 0),
                            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: "Settle" }), void 0),
                            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: "Close" }), void 0)] }, void 0) }, void 0),
                jsx_runtime_1.jsx(core_1.TableBody, { children: openOrdersEntries.map(function (_a) {
                        var market = _a[0], oos = _a[1];
                        return (jsx_runtime_1.jsx(OpenOrdersRow, { market: market, openOrders: oos }, market.toString()));
                    }) }, void 0)] }), void 0) }), void 0));
}
function OpenOrdersRow(_a) {
    var _this = this;
    var _b, _c;
    var market = _a.market, openOrders = _a.openOrders;
    var styles = useStyles();
    var _d = react_1.useState(openOrders[0]), ooAccount = _d[0], setOoAccount = _d[1];
    react_1.useEffect(function () {
        setOoAccount(openOrders[0]);
    }, [openOrders]);
    var _e = Dex_1.useDexContext(), swapClient = _e.swapClient, closeOpenOrders = _e.closeOpenOrders;
    var marketClient = Dex_1.useMarket(market);
    var tokenMap = TokenList_1.useTokenMap();
    var base = Token_1.useMint(marketClient === null || marketClient === void 0 ? void 0 : marketClient.baseMintAddress);
    var quote = Token_1.useMint(marketClient === null || marketClient === void 0 ? void 0 : marketClient.quoteMintAddress);
    var baseWallet = Token_1.useOwnedTokenAccount(marketClient === null || marketClient === void 0 ? void 0 : marketClient.baseMintAddress);
    var quoteWallet = Token_1.useOwnedTokenAccount(marketClient === null || marketClient === void 0 ? void 0 : marketClient.quoteMintAddress);
    var baseTicker = marketClient
        ? (_b = tokenMap.get(marketClient === null || marketClient === void 0 ? void 0 : marketClient.baseMintAddress.toString())) === null || _b === void 0 ? void 0 : _b.symbol
        : "-";
    var quoteTicker = marketClient
        ? (_c = tokenMap.get(marketClient === null || marketClient === void 0 ? void 0 : marketClient.quoteMintAddress.toString())) === null || _c === void 0 ? void 0 : _c.symbol
        : "-";
    var marketName = baseTicker && quoteTicker
        ? baseTicker + " / " + quoteTicker
        : market.toString();
    var settleDisabled = ooAccount.baseTokenFree.toNumber() + ooAccount.quoteTokenFree.toNumber() ===
        0;
    var closeDisabled = ooAccount.baseTokenTotal.toNumber() +
        ooAccount.quoteTokenTotal.toNumber() !==
        0;
    var settleFunds = function () { return __awaiter(_this, void 0, void 0, function () {
        var referrerWallet, _a, transaction, signers;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!marketClient) {
                        throw new Error("Market client not found");
                    }
                    if (!baseWallet || !quoteWallet) {
                        throw new Error("Base or quote wallet not found");
                    }
                    referrerWallet = undefined;
                    return [4 /*yield*/, marketClient.makeSettleFundsTransaction(swapClient.program.provider.connection, ooAccount, baseWallet.publicKey, quoteWallet.publicKey, referrerWallet)];
                case 1:
                    _a = _b.sent(), transaction = _a.transaction, signers = _a.signers;
                    return [4 /*yield*/, swapClient.program.provider.send(transaction, signers)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var _closeOpenOrders = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, swapClient.program.rpc.closeAccount({
                        accounts: {
                            openOrders: ooAccount.address,
                            authority: swapClient.program.provider.wallet.publicKey,
                            destination: swapClient.program.provider.wallet.publicKey,
                            market: marketClient.address,
                            dexProgram: pubkeys_1.DEX_PID,
                        },
                    })];
                case 1:
                    _a.sent();
                    closeOpenOrders(ooAccount);
                    return [2 /*return*/];
            }
        });
    }); };
    return (jsx_runtime_1.jsxs(core_1.TableRow, { children: [jsx_runtime_1.jsx(core_1.TableCell, __assign({ component: "th", scope: "row" }, { children: jsx_runtime_1.jsx(core_1.Typography, { children: jsx_runtime_1.jsx(core_1.Link, __assign({ href: "https://dex.projectserum.com/#/market/" + market.toString(), target: "_blank", rel: "noopener" }, { children: marketName }), void 0) }, void 0) }), void 0),
            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: jsx_runtime_1.jsx(core_1.Select, __assign({ value: ooAccount.address.toString(), onChange: function (e) {
                        return setOoAccount(openOrders.filter(function (oo) { return oo.address.toString() === e.target.value; })[0]);
                    } }, { children: openOrders.map(function (oo) {
                        return (jsx_runtime_1.jsx(core_1.MenuItem, __assign({ value: oo.address.toString() }, { children: oo.address.toString() }), oo.address.toString()));
                    }) }), void 0) }), void 0),
            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: toDisplay(base, ooAccount.baseTokenTotal.sub(ooAccount.baseTokenFree)) }), void 0),
            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: toDisplay(base, ooAccount.baseTokenFree) }), void 0),
            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: toDisplay(quote, ooAccount.quoteTokenTotal.sub(ooAccount.quoteTokenFree)) }), void 0),
            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: toDisplay(quote, ooAccount.quoteTokenFree) }), void 0),
            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: jsx_runtime_1.jsx(core_1.Button, __assign({ color: "primary", disabled: settleDisabled, onClick: settleFunds }, { children: "Settle" }), void 0) }), void 0),
            jsx_runtime_1.jsx(core_1.TableCell, __assign({ align: "center" }, { children: jsx_runtime_1.jsx(core_1.Button, __assign({ disabled: closeDisabled, onClick: _closeOpenOrders, className: styles.closeAccount }, { children: "Close" }), void 0) }), void 0)] }, market.toString()));
}
function toDisplay(mintInfo, value) {
    if (!mintInfo) {
        return value.toNumber().toString();
    }
    return (value.toNumber() / Math.pow(10, mintInfo.decimals)).toFixed(mintInfo.decimals);
}
