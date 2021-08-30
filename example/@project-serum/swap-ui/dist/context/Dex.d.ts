/// <reference types="react" />
import { PublicKey } from "@solana/web3.js";
import { Swap as SwapClient } from "@project-serum/swap";
import { Market, OpenOrders, Orderbook as OrderbookSide } from "@project-serum/serum";
export declare const FEE_MULTIPLIER: number;
declare type DexContext = {
    openOrders: Map<string, Array<OpenOrders>>;
    closeOpenOrders: (openOrder: OpenOrders) => void;
    swapClient: SwapClient;
};
export declare function DexContextProvider(props: any): JSX.Element;
export declare function useDexContext(): DexContext;
export declare function useOpenOrders(): Map<string, Array<OpenOrders>>;
export declare function useMarket(market?: PublicKey): Market | undefined;
export declare function useOrderbook(market?: PublicKey): Orderbook | undefined;
export declare function useMarketName(market: PublicKey): string | null;
export declare function useBbo(market?: PublicKey): Bbo | undefined;
export declare function useFairRoute(fromMint: PublicKey, toMint: PublicKey): number | undefined;
export declare function useRoute(fromMint: PublicKey, toMint: PublicKey): Array<PublicKey> | null;
export declare function useRouteVerbose(fromMint: PublicKey, toMint: PublicKey): {
    markets: Array<PublicKey>;
    kind: RouteKind;
} | null;
declare type Orderbook = {
    bids: OrderbookSide;
    asks: OrderbookSide;
};
declare type RouteKind = "wormhole-native" | "wormhole-sollet" | "usdx";
declare type Bbo = {
    bestBid?: number;
    bestOffer?: number;
    mid?: number;
};
export {};
