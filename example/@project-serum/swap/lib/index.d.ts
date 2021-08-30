import BN from 'bn.js';
import { PublicKey, Signer, Transaction, TransactionSignature, ConfirmOptions } from '@solana/web3.js';
import { TokenListContainer } from '@solana/spl-token-registry';
import { Program, Provider } from '@project-serum/anchor';
import { Market } from '@project-serum/serum';
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
export declare class Swap {
    /**
     * Anchor generated client for the swap program.
     */
    get program(): Program;
    private _program;
    /**
     * Token list registry for fetching USD(x) markets for each mint.
     */
    private get swapMarkets();
    private _swapMarkets;
    /**
     * @param provider  The wallet and network context to use for the client.
     * @param tokenList The token list providing market addresses for each mint.
     */
    constructor(provider: Provider, tokenList: TokenListContainer);
    /**
     * Returns a list of markets to trade across to swap `fromMint` to `toMint`.
     */
    route(fromMint: PublicKey, toMint: PublicKey): PublicKey[] | null;
    /**
     * Executes a swap against the Serum DEX.
     */
    swap(params: SwapParams): Promise<Array<TransactionSignature>>;
    /**
     * Returns transactions for swapping on the Serum DEX.
     */
    swapTxs(params: SwapParams): Promise<Array<SendTxRequest>>;
    private swapDirectTxs;
    private swapTransitiveTxs;
}
/**
 * Parameters to perform a swap.
 */
export declare type SwapParams = {
    /**
     * Token mint to swap from.
     */
    fromMint: PublicKey;
    /**
     * Token mint to swap to.
     */
    toMint: PublicKey;
    /**
     * Token mint used as the quote currency for a transitive swap, i.e., the
     * connecting currency.
     */
    quoteMint?: PublicKey;
    /**
     * Amount of `fromMint` to swap in exchange for `toMint`.
     */
    amount: BN;
    /**
     * The minimum rate used to calculate the number of tokens one
     * should receive for the swap. This is a safety mechanism to prevent one
     * from performing an unexpecteed trade.
     */
    minExchangeRate: ExchangeRate;
    /**
     * Token account to receive the Serum referral fee. The mint must be in the
     * quote currency of the trade (USDC or USDT).
     */
    referral?: PublicKey;
    /**
     * Wallet for `fromMint`. If not provided, uses an associated token address
     * for the configured provider.
     */
    fromWallet?: PublicKey;
    /**
     * Wallet for `toMint`. If not provided, an associated token account will
     * be created for the configured provider.
     */
    toWallet?: PublicKey;
    /**
     * Wallet of the quote currency to use in a transitive swap. Should be either
     * a USDC or USDT wallet. If not provided an associated token account will
     * be created for the configured provider.
     */
    quoteWallet?: PublicKey;
    /**
     * Market client for the first leg of the swap. Can be given to prevent
     * the client from making unnecessary network requests.
     */
    fromMarket: Market;
    /**
     * Market client for the second leg of the swap. Can be given to prevent
     * the client from making unnecessary network requests.
     */
    toMarket?: Market;
    /**
     * Open orders account for the first leg of the swap. If not given, an
     * open orders account will be created.
     */
    fromOpenOrders?: PublicKey;
    /**
     * Open orders account for the second leg of the swap. If not given, an
     * open orders account will be created.
     */
    toOpenOrders?: PublicKey;
    /**
     * RPC options. If not given the options on the program's provider are used.
     */
    options?: ConfirmOptions;
    /**
     * True if all new open orders accounts should be automatically closed.
     * Currently disabled.
     */
    close?: boolean;
    /**
     * Additional transactions to bundle into the swap transaction
     */
    additionalTransactions?: Array<{
        tx: Transaction;
        signers: Signer[];
    }>;
};
declare type ExchangeRate = {
    rate: BN;
    fromDecimals: number;
    quoteDecimals: number;
    strict: boolean;
};
declare type SendTxRequest = {
    tx: Transaction;
    signers: Array<Signer | undefined>;
};
export {};
//# sourceMappingURL=index.d.ts.map