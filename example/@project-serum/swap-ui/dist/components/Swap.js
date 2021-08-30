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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapButton = exports.TokenIcon = exports.SwapTokenForm = exports.ArrowButton = exports.SwapHeader = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var anchor_1 = require("@project-serum/anchor");
var core_1 = require("@material-ui/core");
var icons_1 = require("@material-ui/icons");
var Swap_1 = require("../context/Swap");
var Dex_1 = require("../context/Dex");
var TokenList_1 = require("../context/TokenList");
var Token_1 = require("../context/Token");
var Swap_2 = require("../context/Swap");
var TokenDialog_1 = __importDefault(require("./TokenDialog"));
var Settings_1 = require("./Settings");
var Info_1 = require("./Info");
var pubkeys_1 = require("../utils/pubkeys");
var useStyles = core_1.makeStyles(function (theme) { return ({
    card: {
        width: theme.spacing(50),
        borderRadius: theme.spacing(2),
        boxShadow: "0px 0px 30px 5px rgba(0,0,0,0.075)",
        padding: theme.spacing(2),
    },
    tab: {
        width: "50%",
    },
    settingsButton: {
        padding: 0,
    },
    swapButton: {
        width: "100%",
        borderRadius: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: 16,
        fontWeight: 700,
        padding: theme.spacing(1.5),
    },
    swapToFromButton: {
        display: "block",
        margin: "10px auto 10px auto",
        cursor: "pointer",
    },
    amountInput: {
        fontSize: 22,
        fontWeight: 600,
    },
    input: {
        textAlign: "right",
    },
    swapTokenFormContainer: {
        borderRadius: theme.spacing(2),
        boxShadow: "0px 0px 15px 2px rgba(33,150,243,0.1)",
        display: "flex",
        justifyContent: "space-between",
        padding: theme.spacing(1),
    },
    swapTokenSelectorContainer: {
        marginLeft: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        width: "50%",
    },
    balanceContainer: {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
    },
    maxButton: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
        fontWeight: 700,
        fontSize: "12px",
        cursor: "pointer",
    },
    tokenButton: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        marginBottom: theme.spacing(1),
    },
}); });
function SwapCard(_a) {
    var containerStyle = _a.containerStyle, contentStyle = _a.contentStyle, swapTokenContainerStyle = _a.swapTokenContainerStyle;
    var styles = useStyles();
    return (jsx_runtime_1.jsxs(core_1.Card, __assign({ className: styles.card, style: containerStyle }, { children: [jsx_runtime_1.jsx(SwapHeader, {}, void 0),
            jsx_runtime_1.jsxs("div", __assign({ style: contentStyle }, { children: [jsx_runtime_1.jsx(SwapFromForm, { style: swapTokenContainerStyle }, void 0),
                    jsx_runtime_1.jsx(ArrowButton, {}, void 0),
                    jsx_runtime_1.jsx(SwapToForm, { style: swapTokenContainerStyle }, void 0),
                    jsx_runtime_1.jsx(Info_1.InfoLabel, {}, void 0),
                    jsx_runtime_1.jsx(SwapButton, {}, void 0)] }), void 0)] }), void 0));
}
exports.default = SwapCard;
function SwapHeader() {
    return (jsx_runtime_1.jsxs("div", __assign({ style: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
        } }, { children: [jsx_runtime_1.jsx(core_1.Typography, __assign({ style: {
                    fontSize: 18,
                    fontWeight: 700,
                } }, { children: "SWAP" }), void 0),
            jsx_runtime_1.jsx(Settings_1.SettingsButton, {}, void 0)] }), void 0));
}
exports.SwapHeader = SwapHeader;
function ArrowButton() {
    var styles = useStyles();
    var theme = core_1.useTheme();
    var swapToFromMints = Swap_1.useSwapContext().swapToFromMints;
    return (jsx_runtime_1.jsx(icons_1.ImportExportRounded, { className: styles.swapToFromButton, fontSize: "large", htmlColor: theme.palette.primary.main, onClick: swapToFromMints }, void 0));
}
exports.ArrowButton = ArrowButton;
function SwapFromForm(_a) {
    var style = _a.style;
    var _b = Swap_1.useSwapContext(), fromMint = _b.fromMint, setFromMint = _b.setFromMint, fromAmount = _b.fromAmount, setFromAmount = _b.setFromAmount;
    return (jsx_runtime_1.jsx(SwapTokenForm, { from: true, style: style, mint: fromMint, setMint: setFromMint, amount: fromAmount, setAmount: setFromAmount }, void 0));
}
function SwapToForm(_a) {
    var style = _a.style;
    var _b = Swap_1.useSwapContext(), toMint = _b.toMint, setToMint = _b.setToMint, toAmount = _b.toAmount, setToAmount = _b.setToAmount;
    return (jsx_runtime_1.jsx(SwapTokenForm, { from: false, style: style, mint: toMint, setMint: setToMint, amount: toAmount, setAmount: setToAmount }, void 0));
}
function SwapTokenForm(_a) {
    var from = _a.from, style = _a.style, mint = _a.mint, setMint = _a.setMint, amount = _a.amount, setAmount = _a.setAmount;
    var styles = useStyles();
    var _b = react_1.useState(false), showTokenDialog = _b[0], setShowTokenDialog = _b[1];
    var tokenAccount = Token_1.useOwnedTokenAccount(mint);
    var mintAccount = Token_1.useMint(mint);
    var balance = tokenAccount &&
        mintAccount &&
        tokenAccount.account.amount.toNumber() / Math.pow(10, mintAccount.decimals);
    var formattedAmount = mintAccount && amount
        ? amount.toLocaleString("fullwide", {
            maximumFractionDigits: mintAccount.decimals,
            useGrouping: false,
        })
        : amount;
    return (jsx_runtime_1.jsxs("div", __assign({ className: styles.swapTokenFormContainer, style: style }, { children: [jsx_runtime_1.jsxs("div", __assign({ className: styles.swapTokenSelectorContainer }, { children: [jsx_runtime_1.jsx(TokenButton, { mint: mint, onClick: function () { return setShowTokenDialog(true); } }, void 0),
                    jsx_runtime_1.jsxs(core_1.Typography, __assign({ color: "textSecondary", className: styles.balanceContainer }, { children: [tokenAccount && mintAccount
                                ? "Balance: " + (balance === null || balance === void 0 ? void 0 : balance.toFixed(mintAccount.decimals))
                                : "-",
                            from && !!balance ? (jsx_runtime_1.jsx("span", __assign({ className: styles.maxButton, onClick: function () { return setAmount(balance); } }, { children: "MAX" }), void 0)) : null] }), void 0)] }), void 0),
            jsx_runtime_1.jsx(core_1.TextField, { type: "number", value: formattedAmount, onChange: function (e) { return setAmount(parseFloat(e.target.value)); }, InputProps: {
                    disableUnderline: true,
                    classes: {
                        root: styles.amountInput,
                        input: styles.input,
                    },
                } }, void 0),
            jsx_runtime_1.jsx(TokenDialog_1.default, { setMint: setMint, open: showTokenDialog, onClose: function () { return setShowTokenDialog(false); } }, void 0)] }), void 0));
}
exports.SwapTokenForm = SwapTokenForm;
function TokenButton(_a) {
    var mint = _a.mint, onClick = _a.onClick;
    var styles = useStyles();
    var theme = core_1.useTheme();
    return (jsx_runtime_1.jsxs("div", __assign({ onClick: onClick, className: styles.tokenButton }, { children: [jsx_runtime_1.jsx(TokenIcon, { mint: mint, style: { width: theme.spacing(4) } }, void 0),
            jsx_runtime_1.jsx(TokenName, { mint: mint, style: { fontSize: 14, fontWeight: 700 } }, void 0),
            jsx_runtime_1.jsx(icons_1.ExpandMore, {}, void 0)] }), void 0));
}
function TokenIcon(_a) {
    var mint = _a.mint, style = _a.style;
    var tokenMap = TokenList_1.useTokenMap();
    var tokenInfo = tokenMap.get(mint.toString());
    return (jsx_runtime_1.jsx("div", __assign({ style: {
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
        } }, { children: (tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.logoURI) ? (jsx_runtime_1.jsx("img", { alt: "Logo", style: style, src: tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.logoURI }, void 0)) : (jsx_runtime_1.jsx("div", { style: style }, void 0)) }), void 0));
}
exports.TokenIcon = TokenIcon;
function TokenName(_a) {
    var mint = _a.mint, style = _a.style;
    var tokenMap = TokenList_1.useTokenMap();
    var theme = core_1.useTheme();
    var tokenInfo = tokenMap.get(mint.toString());
    return (jsx_runtime_1.jsx(core_1.Typography, __assign({ style: __assign({ marginLeft: theme.spacing(2), marginRight: theme.spacing(1) }, style) }, { children: tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.symbol }), void 0));
}
function SwapButton() {
    var _this = this;
    var styles = useStyles();
    var _a = Swap_1.useSwapContext(), fromMint = _a.fromMint, toMint = _a.toMint, fromAmount = _a.fromAmount, slippage = _a.slippage, isClosingNewAccounts = _a.isClosingNewAccounts, isStrict = _a.isStrict;
    var swapClient = Dex_1.useDexContext().swapClient;
    var fromMintInfo = Token_1.useMint(fromMint);
    var toMintInfo = Token_1.useMint(toMint);
    var openOrders = Dex_1.useOpenOrders();
    var route = Dex_1.useRouteVerbose(fromMint, toMint);
    var fromMarket = Dex_1.useMarket(route && route.markets ? route.markets[0] : undefined);
    var toMarket = Dex_1.useMarket(route && route.markets ? route.markets[1] : undefined);
    var canSwap = Swap_2.useCanSwap();
    var referral = Swap_2.useReferral(fromMarket);
    var fair = Swap_1.useSwapFair();
    var fromWallet = Token_1.useOwnedTokenAccount(fromMint);
    var toWallet = Token_1.useOwnedTokenAccount(toMint);
    var quoteMint = fromMarket && fromMarket.quoteMintAddress;
    var quoteMintInfo = Token_1.useMint(quoteMint);
    var quoteWallet = Token_1.useOwnedTokenAccount(quoteMint);
    // Click handler.
    var sendSwapTransaction = function () { return __awaiter(_this, void 0, void 0, function () {
        var amount, isSol, wrappedSolAccount, txs, _a, wrapTx, wrapSigners, _b, unwrapTx, unwrapSigners, tx;
        var _c, _d;
        var _this = this;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!fromMintInfo || !toMintInfo) {
                        throw new Error("Unable to calculate mint decimals");
                    }
                    if (!fair) {
                        throw new Error("Invalid fair");
                    }
                    if (!quoteMint || !quoteMintInfo) {
                        throw new Error("Quote mint not found");
                    }
                    amount = new anchor_1.BN(fromAmount * Math.pow(10, fromMintInfo.decimals));
                    isSol = fromMint.equals(pubkeys_1.SOL_MINT) || toMint.equals(pubkeys_1.SOL_MINT);
                    wrappedSolAccount = isSol ? web3_js_1.Keypair.generate() : undefined;
                    return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            var minExchangeRate, fromOpenOrders, toOpenOrders, fromWalletAddr, toWalletAddr;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!fromMarket) {
                                            throw new Error("Market undefined");
                                        }
                                        minExchangeRate = {
                                            rate: new anchor_1.BN((Math.pow(10, toMintInfo.decimals) * Dex_1.FEE_MULTIPLIER) / fair)
                                                .muln(100 - slippage)
                                                .divn(100),
                                            fromDecimals: fromMintInfo.decimals,
                                            quoteDecimals: quoteMintInfo.decimals,
                                            strict: isStrict,
                                        };
                                        fromOpenOrders = fromMarket
                                            ? openOrders.get(fromMarket === null || fromMarket === void 0 ? void 0 : fromMarket.address.toString())
                                            : undefined;
                                        toOpenOrders = toMarket
                                            ? openOrders.get(toMarket === null || toMarket === void 0 ? void 0 : toMarket.address.toString())
                                            : undefined;
                                        fromWalletAddr = fromMint.equals(pubkeys_1.SOL_MINT)
                                            ? wrappedSolAccount.publicKey
                                            : fromWallet
                                                ? fromWallet.publicKey
                                                : undefined;
                                        toWalletAddr = toMint.equals(pubkeys_1.SOL_MINT)
                                            ? wrappedSolAccount.publicKey
                                            : toWallet
                                                ? toWallet.publicKey
                                                : undefined;
                                        return [4 /*yield*/, swapClient.swapTxs({
                                                fromMint: fromMint,
                                                toMint: toMint,
                                                quoteMint: quoteMint,
                                                amount: amount,
                                                minExchangeRate: minExchangeRate,
                                                referral: referral,
                                                fromMarket: fromMarket,
                                                toMarket: toMarket,
                                                // Automatically created if undefined.
                                                fromOpenOrders: fromOpenOrders ? fromOpenOrders[0].address : undefined,
                                                toOpenOrders: toOpenOrders ? toOpenOrders[0].address : undefined,
                                                fromWallet: fromWalletAddr,
                                                toWallet: toWalletAddr,
                                                quoteWallet: quoteWallet ? quoteWallet.publicKey : undefined,
                                                // Auto close newly created open orders accounts.
                                                close: isClosingNewAccounts,
                                            })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })()];
                case 1:
                    txs = _e.sent();
                    if (!isSol) return [3 /*break*/, 3];
                    if (txs.length > 1) {
                        throw new Error("SOL must be swapped in a single transaction");
                    }
                    return [4 /*yield*/, wrapSol(swapClient.program.provider, wrappedSolAccount, fromMint, amount)];
                case 2:
                    _a = _e.sent(), wrapTx = _a.tx, wrapSigners = _a.signers;
                    _b = unwrapSol(swapClient.program.provider, wrappedSolAccount), unwrapTx = _b.tx, unwrapSigners = _b.signers;
                    tx = new web3_js_1.Transaction();
                    tx.add(wrapTx);
                    tx.add(txs[0].tx);
                    tx.add(unwrapTx);
                    txs[0].tx = tx;
                    (_c = txs[0].signers).push.apply(_c, wrapSigners);
                    (_d = txs[0].signers).push.apply(_d, unwrapSigners);
                    _e.label = 3;
                case 3: return [4 /*yield*/, swapClient.program.provider.sendAll(txs)];
                case 4:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (jsx_runtime_1.jsx(core_1.Button, __assign({ variant: "contained", className: styles.swapButton, onClick: sendSwapTransaction, disabled: !canSwap }, { children: "Swap" }), void 0));
}
exports.SwapButton = SwapButton;
function wrapSol(provider, wrappedSolAccount, fromMint, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var tx, signers, _a, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    tx = new web3_js_1.Transaction();
                    signers = [wrappedSolAccount];
                    // Create new, rent exempt account.
                    _b = (_a = tx).add;
                    _d = (_c = web3_js_1.SystemProgram).createAccount;
                    _e = {
                        fromPubkey: provider.wallet.publicKey,
                        newAccountPubkey: wrappedSolAccount.publicKey
                    };
                    return [4 /*yield*/, spl_token_1.Token.getMinBalanceRentForExemptAccount(provider.connection)];
                case 1:
                    // Create new, rent exempt account.
                    _b.apply(_a, [_d.apply(_c, [(_e.lamports = _f.sent(),
                                _e.space = 165,
                                _e.programId = spl_token_1.TOKEN_PROGRAM_ID,
                                _e)])]);
                    // Transfer lamports. These will be converted to an SPL balance by the
                    // token program.
                    if (fromMint.equals(pubkeys_1.SOL_MINT)) {
                        tx.add(web3_js_1.SystemProgram.transfer({
                            fromPubkey: provider.wallet.publicKey,
                            toPubkey: wrappedSolAccount.publicKey,
                            lamports: amount.toNumber(),
                        }));
                    }
                    // Initialize the account.
                    tx.add(spl_token_1.Token.createInitAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, pubkeys_1.WRAPPED_SOL_MINT, wrappedSolAccount.publicKey, provider.wallet.publicKey));
                    return [2 /*return*/, { tx: tx, signers: signers }];
            }
        });
    });
}
function unwrapSol(provider, wrappedSolAccount) {
    var tx = new web3_js_1.Transaction();
    tx.add(spl_token_1.Token.createCloseAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, wrappedSolAccount.publicKey, provider.wallet.publicKey, provider.wallet.publicKey, []));
    return { tx: tx, signers: [] };
}
