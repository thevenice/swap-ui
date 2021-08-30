import { UseAsyncReturn } from "react-async-hook";
import { Connection, PublicKey } from "@solana/web3.js";
declare type SolletInfo = {
    blockchain: string;
    erc20Contract: string;
    name: string;
    splMint: PublicKey;
    ticker: string;
};
export declare function useSolletInfo(mint: PublicKey): UseAsyncReturn<SolletInfo>;
export declare function fetchSolletInfo(mint: PublicKey): Promise<SolletInfo>;
export declare function requestWormholeSwapMarketIfNeeded(connection: Connection, solletMint: PublicKey, wormholeMint: PublicKey, swapMarket: PublicKey, solletInfo: SolletInfo): Promise<boolean>;
export declare function swapApiRequest(method: string, path: string, body?: Object): Promise<any>;
export declare class SwapApiError extends Error {
    readonly name: string;
    readonly status: number;
    constructor(msg: string, status: number);
}
export {};
