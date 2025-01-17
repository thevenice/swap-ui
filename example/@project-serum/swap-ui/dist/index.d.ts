import { ReactElement } from "react";
import { PublicKey } from "@solana/web3.js";
import { TokenListContainer } from "@solana/spl-token-registry";
import { Provider } from "@project-serum/anchor";
import { ThemeOptions } from "@material-ui/core/styles";
import { SwapContextProvider, useSwapContext, useSwapFair } from "./context/Swap";
import { DexContextProvider, useBbo, useFairRoute, useMarketName } from "./context/Dex";
import { TokenListContextProvider, useTokenMap } from "./context/TokenList";
import { TokenContextProvider, useMint } from "./context/Token";
import SwapCard, { ArrowButton, SwapButton, SwapHeader, SwapTokenForm } from "./components/Swap";
import TokenDialog from "./components/TokenDialog";
/**
 * A`Swap` component that can be embedded into applications. To use,
 * one can, minimally, provide a provider and token list to the component.
 * For example,
 *
 * ```javascript
 * <Swap provider={provider} tokenList={tokenList} />
 * ```
 *
 * All of the complexity of communicating with the Serum DEX and managing
 * its data is handled internally by the component.
 *
 * For information on other properties like earning referrals, see the
 * [[SwapProps]] documentation.
 */
export default function Swap(props: SwapProps): ReactElement;
/**
 * Properties for the `Swap` Component.
 */
export declare type SwapProps = {
    /**
     * Wallet and network provider. Apps can use a `Provider` subclass to hook
     * into all transactions intitiated by the component.
     */
    provider: Provider;
    /**
     * Token list providing information for tokens used.
     */
    tokenList: TokenListContainer;
    /**
     * Wallet address to which referral fees are sent (i.e. a SOL address).
     * To receive referral fees, the wallet must *own* associated token
     * accounts for the token in which the referral is paid  (usually USDC
     * or USDT).
     */
    referral?: PublicKey;
    /**
     * The default `fromMint` to use when the component first renders.
     */
    fromMint?: PublicKey;
    /**
     * The default `toMint` to use when the component first renders.
     */
    toMint?: PublicKey;
    /**
     * The initial amount for the `fromMint` to use when the component first
     * renders.
     */
    fromAmount?: number;
    /**
     * The initial amount for the `toMint` to use when the component first
     * renders.
     */
    toAmount?: number;
    /**
     * Provide custom material-ui theme.
     */
    materialTheme?: ThemeOptions;
    /**
     * Styling properties for the main container.
     */
    containerStyle?: any;
    /**
     * Styling properties for the content container.
     */
    contentStyle?: any;
    /**
     * Styling properties for the from and to token containers.
     */
    swapTokenContainerStyle?: any;
};
export { Swap, SwapCard, SwapHeader, SwapTokenForm, ArrowButton, SwapButton, TokenDialog, SwapContextProvider, useSwapContext, useSwapFair, TokenListContextProvider, useTokenMap, TokenContextProvider, useMint, DexContextProvider, useFairRoute, useMarketName, useBbo, };
