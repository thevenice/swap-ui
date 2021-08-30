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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSwappableTokens = exports.useTokenMap = exports.useTokenListContext = exports.TokenListContextProvider = exports.SPL_REGISTRY_WORM_TAG = exports.SPL_REGISTRY_SOLLET_TAG = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var pubkeys_1 = require("../utils/pubkeys");
var _TokenListContext = react_1.default.createContext(null);
// Tag in the spl-token-registry for sollet wrapped tokens.
exports.SPL_REGISTRY_SOLLET_TAG = "wrapped-sollet";
// Tag in the spl-token-registry for wormhole wrapped tokens.
exports.SPL_REGISTRY_WORM_TAG = "wormhole";
var SOL_TOKEN_INFO = {
    chainId: 101,
    address: pubkeys_1.SOL_MINT.toString(),
    name: "Native SOL",
    decimals: "9",
    symbol: "SOL",
    logoURI: "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png",
    tags: [],
    extensions: {
        website: "https://solana.com/",
        serumV3Usdc: "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
        serumV3Usdt: "HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1",
        coingeckoId: "solana",
        waterfallbot: "https://t.me/SOLwaterfall",
    },
};
function TokenListContextProvider(props) {
    var tokenList = react_1.useMemo(function () {
        var list = props.tokenList.filterByClusterSlug("mainnet-beta").getList();
        // Manually add a fake SOL mint for the native token. The component is
        // opinionated in that it distinguishes between wrapped SOL and SOL.
        list.push(SOL_TOKEN_INFO);
        return list;
    }, [props.tokenList]);
    // Token map for quick lookup.
    var tokenMap = react_1.useMemo(function () {
        var tokenMap = new Map();
        tokenList.forEach(function (t) {
            tokenMap.set(t.address, t);
        });
        return tokenMap;
    }, [tokenList]);
    // Tokens with USD(x) quoted markets.
    var swappableTokens = react_1.useMemo(function () {
        var tokens = tokenList.filter(function (t) {
            var _a, _b;
            var isUsdxQuoted = ((_a = t.extensions) === null || _a === void 0 ? void 0 : _a.serumV3Usdt) || ((_b = t.extensions) === null || _b === void 0 ? void 0 : _b.serumV3Usdc);
            return isUsdxQuoted;
        });
        tokens.sort(function (a, b) {
            return a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0;
        });
        return tokens;
    }, [tokenList, tokenMap]);
    // Sollet wrapped tokens.
    var _a = react_1.useMemo(function () {
        var tokens = tokenList.filter(function (t) {
            var _a;
            var isSollet = (_a = t.tags) === null || _a === void 0 ? void 0 : _a.includes(exports.SPL_REGISTRY_SOLLET_TAG);
            return isSollet;
        });
        tokens.sort(function (a, b) {
            return a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0;
        });
        return [
            tokens,
            new Map(tokens.map(function (t) { return [t.address, t]; })),
        ];
    }, [tokenList]), swappableTokensSollet = _a[0], solletMap = _a[1];
    // Wormhole wrapped tokens.
    var _b = react_1.useMemo(function () {
        var tokens = tokenList.filter(function (t) {
            var _a;
            var isSollet = (_a = t.tags) === null || _a === void 0 ? void 0 : _a.includes(exports.SPL_REGISTRY_WORM_TAG);
            return isSollet;
        });
        tokens.sort(function (a, b) {
            return a.symbol < b.symbol ? -1 : a.symbol > b.symbol ? 1 : 0;
        });
        return [
            tokens,
            new Map(tokens.map(function (t) { return [t.address, t]; })),
        ];
    }, [tokenList]), swappableTokensWormhole = _b[0], wormholeMap = _b[1];
    return (jsx_runtime_1.jsx(_TokenListContext.Provider, __assign({ value: {
            tokenMap: tokenMap,
            wormholeMap: wormholeMap,
            solletMap: solletMap,
            swappableTokens: swappableTokens,
            swappableTokensWormhole: swappableTokensWormhole,
            swappableTokensSollet: swappableTokensSollet,
        } }, { children: props.children }), void 0));
}
exports.TokenListContextProvider = TokenListContextProvider;
function useTokenListContext() {
    var ctx = react_1.useContext(_TokenListContext);
    if (ctx === null) {
        throw new Error("Context not available");
    }
    return ctx;
}
exports.useTokenListContext = useTokenListContext;
function useTokenMap() {
    var tokenMap = useTokenListContext().tokenMap;
    return tokenMap;
}
exports.useTokenMap = useTokenMap;
function useSwappableTokens() {
    var _a = useTokenListContext(), swappableTokens = _a.swappableTokens, swappableTokensWormhole = _a.swappableTokensWormhole, swappableTokensSollet = _a.swappableTokensSollet;
    return { swappableTokens: swappableTokens, swappableTokensWormhole: swappableTokensWormhole, swappableTokensSollet: swappableTokensSollet };
}
exports.useSwappableTokens = useSwappableTokens;
