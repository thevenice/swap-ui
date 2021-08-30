"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swap = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const anchor_1 = require("@project-serum/anchor");
const serum_1 = require("@project-serum/serum");
const idl_1 = require("./idl");
const utils_1 = require("./utils");
const swap_markets_1 = __importDefault(require("./swap-markets"));
// Close account feature flag.
//
// TODO: enable once the DEX supports closing open orders accounts.
const CLOSE_ENABLED = false;
// Initialize open orders feature flag.
//
// TODO: enable once the DEX supports initializing open orders accounts.
const OPEN_ENABLED = false;
/**
 *
 * # Swap
 *
 * A module to swap tokens across markets the Serum DEX, providing a thin
 * wrapper around an [Anchor](https://github.com/project-serum/anchor) client
 * for the purpose of providing a simplified `swap` API.
 *
 * ## Swap Program Basics
 *
 * One should have a basic understanding of the on-chain
 * [Swap](https://github.com/project-serum/swap) program before using the
 * client. Two core APIs are exposed.
 *
 * * [swap](https://github.com/project-serum/swap/blob/master/programs/swap/src/lib.rs#L36) -
 *   swaps two tokens on a single A/B market. This is just an IOC trade at the
 *   BBO that instantly settles.
 * * [swapTransitive](https://github.com/project-serum/swap/blob/master/programs/swap/src/lib.rs#L107) -
 *   swaps two tokens across **two** A/x, B/x markets in the same manner as
 *   `swap`.
 *
 * For both APIs, if the number of tokens received from the trade is less than
 * the client provided `minExchangeRate`, the transaction aborts.
 *
 * Note that if this client package is insufficient, one can always use the
 * Anchor generated client directly, exposing an API mapping one-to-one to
 * these program instructions. See the
 * [`tests/`](https://github.com/project-serum/swap/blob/master/tests/swap.js)
 * for examples of using the Anchor generated swap client.
 *
 * ## Serum Orderbook Program Basics
 *
 * Additionally, because the Swap program is an on-chain frontend for the Serum
 * DEX, one should also be aware of the basic accounts needed for trading on
 * the Serum DEX.
 *
 * Namely, a wallet must have an "open orders" account for each market the
 * wallet trades on. The "open orders" account is akin to how a wallet
 *  must have an SPL token account to own tokens, except instead of holding
 * tokens, the wallet can make trades on the orderbook.
 *
 * ### Creating Open Orders Accounts
 *
 * When the wallet doesn't have an open orders account already created,
 * the swap client provides two choices. Automatically create the required
 * accounts by preloading the instructions in the [[swap]] transaction.
 *
 * Note that if the user is swapping between two non-USD(x) tokens, e.g., wBTC
 * for wETH, then the user needs *two* open orders accounts on both wBTC/USD(x)
 * and wETH/USD(x) markets. In the event both of these open orders accounts are
 * created for the rfirst time, then the transaction is broken up into two
 * (and `Provider.sendAll` is used) to prevent hitting transaction size limits.
 */
class Swap {
    /**
     * @param provider  The wallet and network context to use for the client.
     * @param tokenList The token list providing market addresses for each mint.
     */
    constructor(provider, tokenList) {
        this._program = new anchor_1.Program(idl_1.IDL, utils_1.SWAP_PID, provider);
        this._swapMarkets = new swap_markets_1.default(provider, tokenList);
    }
    /**
     * Anchor generated client for the swap program.
     */
    get program() {
        return this._program;
    }
    /**
     * Token list registry for fetching USD(x) markets for each mint.
     */
    get swapMarkets() {
        return this._swapMarkets;
    }
    /**
     * Returns a list of markets to trade across to swap `fromMint` to `toMint`.
     */
    route(fromMint, toMint) {
        return this.swapMarkets.route(fromMint, toMint);
    }
    /**
     * Executes a swap against the Serum DEX.
     */
    async swap(params) {
        let txs = await this.swapTxs(params);
        if (params.additionalTransactions) {
            txs = txs.concat(params.additionalTransactions);
        }
        return this.program.provider.sendAll(txs, params.options);
    }
    /**
     * Returns transactions for swapping on the Serum DEX.
     */
    async swapTxs(params) {
        let { fromMint, toMint, quoteWallet, fromWallet, toWallet, quoteMint, fromMarket, toMarket, amount, minExchangeRate, referral, close, fromOpenOrders, toOpenOrders, } = params;
        // If swapping to/from a USD(x) token, then swap directly on the market.
        if (isUsdx(fromMint)) {
            let coinWallet = toWallet;
            let pcWallet = fromWallet;
            let baseMint = toMint;
            let quoteMint = fromMint;
            let side = Side.Bid;
            // Special case USDT/USDC market since the coin is always USDT and
            // the pc is always USDC.
            if (toMint.equals(utils_1.USDC_PUBKEY)) {
                coinWallet = fromWallet;
                pcWallet = toWallet;
                baseMint = fromMint;
                quoteMint = toMint;
                side = Side.Ask;
            }
            else if (toMint.equals(utils_1.USDT_PUBKEY)) {
                coinWallet = toWallet;
                pcWallet = fromWallet;
                baseMint = toMint;
                quoteMint = quoteMint;
                side = Side.Bid;
            }
            return await this.swapDirectTxs({
                coinWallet,
                pcWallet,
                baseMint,
                quoteMint,
                side,
                amount,
                minExchangeRate,
                referral,
                close,
                fromMarket,
                fromOpenOrders,
            });
        }
        else if (isUsdx(toMint)) {
            return await this.swapDirectTxs({
                coinWallet: fromWallet,
                pcWallet: toWallet,
                baseMint: fromMint,
                quoteMint: toMint,
                side: Side.Ask,
                amount,
                minExchangeRate,
                referral,
                close,
                fromMarket,
                fromOpenOrders,
            });
        }
        // Direct swap market explicitly given.
        if (fromMarket !== undefined && toMarket === undefined) {
            return await this.swapDirectTxs({
                coinWallet: fromWallet,
                pcWallet: toWallet,
                baseMint: fromMint,
                quoteMint: toMint,
                side: fromMint.equals(fromMarket.baseMintAddress) ? Side.Ask : Side.Bid,
                amount,
                minExchangeRate,
                referral,
                close,
                fromMarket,
                fromOpenOrders,
            });
        }
        // Neither wallet is a USD stable coin. So perform a transitive swap.
        if (!quoteMint) {
            throw new Error('quoteMint must be provided for a transitive swap');
        }
        if (!toMarket) {
            throw new Error('toMarket must be provided for transitive swaps');
        }
        return await this.swapTransitiveTxs({
            fromMint,
            toMint,
            pcMint: quoteMint,
            fromWallet,
            toWallet,
            pcWallet: quoteWallet,
            amount,
            minExchangeRate,
            referral,
            close,
            fromMarket,
            toMarket,
            fromOpenOrders,
            toOpenOrders,
        });
    }
    async swapDirectTxs({ coinWallet, pcWallet, baseMint, quoteMint, side, amount, minExchangeRate, referral, close, fromMarket, fromOpenOrders, }) {
        const [vaultSigner] = await utils_1.getVaultOwnerAndNonce(fromMarket.address);
        let openOrders = fromOpenOrders;
        const needsOpenOrders = openOrders === undefined;
        const tx = new web3_js_1.Transaction();
        const signers = [];
        // If either wallet isn't given, then create the associated token account.
        if (!coinWallet) {
            coinWallet = await utils_1.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, baseMint, this.program.provider.wallet.publicKey);
            tx.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, baseMint, coinWallet, this.program.provider.wallet.publicKey, this.program.provider.wallet.publicKey));
        }
        if (!pcWallet) {
            pcWallet = await utils_1.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, quoteMint, this.program.provider.wallet.publicKey);
            tx.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, quoteMint, pcWallet, this.program.provider.wallet.publicKey, this.program.provider.wallet.publicKey));
        }
        // Create the open orders account, if needed.
        if (needsOpenOrders) {
            const oo = web3_js_1.Keypair.generate();
            signers.push(oo);
            openOrders = oo.publicKey;
            tx.add(await serum_1.OpenOrders.makeCreateAccountTransaction(this.program.provider.connection, fromMarket.address, this.program.provider.wallet.publicKey, oo.publicKey, utils_1.DEX_PID));
        }
        tx.add(this.program.instruction.swap(side, amount, minExchangeRate, {
            accounts: {
                market: {
                    market: fromMarket.address,
                    // @ts-ignore
                    requestQueue: fromMarket._decoded.requestQueue,
                    // @ts-ignore
                    eventQueue: fromMarket._decoded.eventQueue,
                    bids: fromMarket.bidsAddress,
                    asks: fromMarket.asksAddress,
                    // @ts-ignore
                    coinVault: fromMarket._decoded.baseVault,
                    // @ts-ignore
                    pcVault: fromMarket._decoded.quoteVault,
                    vaultSigner,
                    openOrders,
                    orderPayerTokenAccount: side.bid ? pcWallet : coinWallet,
                    coinWallet: coinWallet,
                },
                pcWallet,
                authority: this.program.provider.wallet.publicKey,
                dexProgram: utils_1.DEX_PID,
                tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                rent: spl_token_1.TOKEN_PROGRAM_ID,
            },
            remainingAccounts: referral && [
                { pubkey: referral, isWritable: true, isSigner: false },
            ],
        }));
        // If an account was opened for this swap, then close it in the same
        // transaction.
        if (CLOSE_ENABLED && close && needsOpenOrders) {
            tx.add(this.program.instruction.closeAccount({
                accounts: {
                    openOrders,
                    authority: this.program.provider.wallet.publicKey,
                    destination: this.program.provider.wallet.publicKey,
                    market: fromMarket.address,
                    dexProgram: utils_1.DEX_PID,
                },
            }));
        }
        return [{ tx, signers }];
    }
    async swapTransitiveTxs({ fromMint, toMint, pcMint, fromWallet, toWallet, pcWallet, amount, minExchangeRate, referral, close, fromMarket, toMarket, fromOpenOrders, toOpenOrders, }) {
        // If the open orders are undefined, assume they don't exist.
        const fromNeedsOpenOrders = fromOpenOrders === undefined;
        const toNeedsOpenOrders = toOpenOrders === undefined;
        // In the event the transaction would be over the transaction size limit,
        // we break up the transaction into multiple and use `Provider.sendAll`
        // as a workaround, providing a single user flow for the swap action.
        //
        // Alternatively, one could breakup the different actions here into explicit
        // user flows. I.e., three separate flows for creating open orders
        // counts, swapping, and closing open orders accounts. If choosing to do
        // this, it's recommended to use the anchor generated client directly,
        // instead of the client here.
        let openOrdersTransaction = undefined;
        const openOrdersSigners = [];
        const swapTransaction = new web3_js_1.Transaction();
        const swapSigners = [];
        let closeTransaction = undefined;
        const closeSigners = [];
        // Calculate the vault signers for each market.
        const [fromVaultSigner] = await utils_1.getVaultOwnerAndNonce(fromMarket.address);
        const [toVaultSigner] = await utils_1.getVaultOwnerAndNonce(toMarket.address);
        // If token accounts aren't given, create them.
        if (!fromWallet) {
            fromWallet = await utils_1.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fromMint, this.program.provider.wallet.publicKey);
            swapTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, fromMint, fromWallet, this.program.provider.wallet.publicKey, this.program.provider.wallet.publicKey));
        }
        if (!toWallet) {
            toWallet = await utils_1.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, toMint, this.program.provider.wallet.publicKey);
            swapTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, toMint, toWallet, this.program.provider.wallet.publicKey, this.program.provider.wallet.publicKey));
        }
        if (!pcWallet) {
            pcWallet = await utils_1.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, pcMint, this.program.provider.wallet.publicKey);
            swapTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, pcMint, pcWallet, this.program.provider.wallet.publicKey, this.program.provider.wallet.publicKey));
        }
        // Add instructions to create open orders, if needed.
        //
        // If creating open orders accounts on *both* from and to markets, then
        // split out the create open orders instructions into their own transaction.
        if (fromNeedsOpenOrders && toNeedsOpenOrders) {
            openOrdersTransaction = new web3_js_1.Transaction();
            const ooFrom = web3_js_1.Keypair.generate();
            openOrdersSigners.push(ooFrom);
            openOrdersTransaction.add(await serum_1.OpenOrders.makeCreateAccountTransaction(this.program.provider.connection, fromMarket.address, this.program.provider.wallet.publicKey, ooFrom.publicKey, utils_1.DEX_PID));
            fromOpenOrders = ooFrom.publicKey;
            const ooTo = web3_js_1.Keypair.generate();
            openOrdersSigners.push(ooTo);
            openOrdersTransaction.add(await serum_1.OpenOrders.makeCreateAccountTransaction(this.program.provider.connection, toMarket.address, this.program.provider.wallet.publicKey, ooTo.publicKey, utils_1.DEX_PID));
            toOpenOrders = ooTo.publicKey;
            if (OPEN_ENABLED) {
                openOrdersTransaction.add(this.program.instruction.initAccount({
                    accounts: {
                        openOrders: ooFrom.publicKey,
                        authority: this.program.provider.wallet.publicKey,
                        market: fromMarket.address,
                        dexProgram: utils_1.DEX_PID,
                        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                    },
                }));
                openOrdersTransaction.add(this.program.instruction.initAccount({
                    accounts: {
                        openOrders: ooTo.publicKey,
                        authority: this.program.provider.wallet.publicKey,
                        market: fromMarket.address,
                        dexProgram: utils_1.DEX_PID,
                        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                    },
                }));
            }
        }
        else if (fromNeedsOpenOrders) {
            const oo = web3_js_1.Keypair.generate();
            swapSigners.push(oo);
            swapTransaction.add(await serum_1.OpenOrders.makeCreateAccountTransaction(this.program.provider.connection, fromMarket.address, this.program.provider.wallet.publicKey, oo.publicKey, utils_1.DEX_PID));
            fromOpenOrders = oo.publicKey;
        }
        else if (toNeedsOpenOrders) {
            const oo = web3_js_1.Keypair.generate();
            swapSigners.push(oo);
            swapTransaction.add(await serum_1.OpenOrders.makeCreateAccountTransaction(this.program.provider.connection, toMarket.address, this.program.provider.wallet.publicKey, oo.publicKey, utils_1.DEX_PID));
            toOpenOrders = oo.publicKey;
        }
        swapTransaction.add(this.program.instruction.swapTransitive(amount, minExchangeRate, {
            accounts: {
                from: {
                    market: fromMarket.address,
                    // @ts-ignore
                    requestQueue: fromMarket._decoded.requestQueue,
                    // @ts-ignore
                    eventQueue: fromMarket._decoded.eventQueue,
                    bids: fromMarket.bidsAddress,
                    asks: fromMarket.asksAddress,
                    // @ts-ignore
                    coinVault: fromMarket._decoded.baseVault,
                    // @ts-ignore
                    pcVault: fromMarket._decoded.quoteVault,
                    vaultSigner: fromVaultSigner,
                    openOrders: fromOpenOrders,
                    orderPayerTokenAccount: fromWallet,
                    coinWallet: fromWallet,
                },
                to: {
                    market: toMarket.address,
                    // @ts-ignore
                    requestQueue: toMarket._decoded.requestQueue,
                    // @ts-ignore
                    eventQueue: toMarket._decoded.eventQueue,
                    bids: toMarket.bidsAddress,
                    asks: toMarket.asksAddress,
                    // @ts-ignore
                    coinVault: toMarket._decoded.baseVault,
                    // @ts-ignore
                    pcVault: toMarket._decoded.quoteVault,
                    vaultSigner: toVaultSigner,
                    openOrders: toOpenOrders,
                    orderPayerTokenAccount: pcWallet,
                    coinWallet: toWallet,
                },
                pcWallet,
                authority: this.program.provider.wallet.publicKey,
                dexProgram: utils_1.DEX_PID,
                tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                rent: spl_token_1.TOKEN_PROGRAM_ID,
            },
            remainingAccounts: referral && [
                { pubkey: referral, isWritable: true, isSigner: false },
            ],
        }));
        if (CLOSE_ENABLED && close && fromNeedsOpenOrders) {
            closeTransaction = new web3_js_1.Transaction();
            closeTransaction.add(this.program.instruction.closeAccount({
                accounts: {
                    openOrders: fromOpenOrders,
                    authority: this.program.provider.wallet.publicKey,
                    destination: this.program.provider.wallet.publicKey,
                    market: fromMarket.address,
                    dexProgram: utils_1.DEX_PID,
                },
            }));
        }
        if (CLOSE_ENABLED && close && toNeedsOpenOrders) {
            if (!closeTransaction) {
                closeTransaction = new web3_js_1.Transaction();
            }
            closeTransaction.add(this.program.instruction.closeAccount({
                accounts: {
                    openOrders: toOpenOrders,
                    authority: this.program.provider.wallet.publicKey,
                    destination: this.program.provider.wallet.publicKey,
                    market: toMarket.address,
                    dexProgram: utils_1.DEX_PID,
                },
            }));
        }
        const txs = [];
        if (openOrdersTransaction !== undefined) {
            txs.push({ tx: openOrdersTransaction, signers: openOrdersSigners });
        }
        txs.push({ tx: swapTransaction, signers: swapSigners });
        if (closeTransaction !== undefined) {
            txs.push({ tx: closeTransaction, signers: closeSigners });
        }
        return txs;
    }
}
exports.Swap = Swap;
function isUsdx(mint) {
    return mint.equals(utils_1.USDC_PUBKEY) || mint.equals(utils_1.USDT_PUBKEY);
}
const Side = {
    Bid: { bid: {} },
    Ask: { ask: {} },
};
//# sourceMappingURL=index.js.map