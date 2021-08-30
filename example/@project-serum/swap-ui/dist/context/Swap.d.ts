/// <reference types="react" />
import { PublicKey } from "@solana/web3.js";
import { Market } from "@project-serum/serum";
export declare type SwapContext = {
    fromMint: PublicKey;
    setFromMint: (m: PublicKey) => void;
    toMint: PublicKey;
    setToMint: (m: PublicKey) => void;
    fromAmount: number;
    setFromAmount: (a: number) => void;
    toAmount: number;
    setToAmount: (a: number) => void;
    swapToFromMints: () => void;
    slippage: number;
    setSlippage: (n: number) => void;
    fairOverride: number | null;
    setFairOverride: (n: number | null) => void;
    referral?: PublicKey;
    isClosingNewAccounts: boolean;
    isStrict: boolean;
    setIsStrict: (isStrict: boolean) => void;
    setIsClosingNewAccounts: (b: boolean) => void;
};
export declare function SwapContextProvider(props: any): JSX.Element;
export declare function useSwapContext(): SwapContext;
export declare function useSwapFair(): number | undefined;
export declare function useCanSwap(): boolean;
export declare function useReferral(fromMarket?: Market): PublicKey | undefined;
