/// <reference types="react" />
import { TokenInfo } from "@solana/spl-token-registry";
declare type TokenListContext = {
    tokenMap: Map<string, TokenInfo>;
    wormholeMap: Map<string, TokenInfo>;
    solletMap: Map<string, TokenInfo>;
    swappableTokens: TokenInfo[];
    swappableTokensSollet: TokenInfo[];
    swappableTokensWormhole: TokenInfo[];
};
export declare const SPL_REGISTRY_SOLLET_TAG = "wrapped-sollet";
export declare const SPL_REGISTRY_WORM_TAG = "wormhole";
export declare function TokenListContextProvider(props: any): JSX.Element;
export declare function useTokenListContext(): TokenListContext;
export declare function useTokenMap(): Map<string, TokenInfo>;
export declare function useSwappableTokens(): {
    swappableTokens: TokenInfo[];
    swappableTokensWormhole: TokenInfo[];
    swappableTokensSollet: TokenInfo[];
};
export {};
