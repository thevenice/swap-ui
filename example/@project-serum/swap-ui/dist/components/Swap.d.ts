/// <reference types="react" />
import { PublicKey } from "@solana/web3.js";
export default function SwapCard({ containerStyle, contentStyle, swapTokenContainerStyle, }: {
    containerStyle?: any;
    contentStyle?: any;
    swapTokenContainerStyle?: any;
}): JSX.Element;
export declare function SwapHeader(): JSX.Element;
export declare function ArrowButton(): JSX.Element;
export declare function SwapTokenForm({ from, style, mint, setMint, amount, setAmount, }: {
    from: boolean;
    style?: any;
    mint: PublicKey;
    setMint: (m: PublicKey) => void;
    amount: number;
    setAmount: (a: number) => void;
}): JSX.Element;
export declare function TokenIcon({ mint, style }: {
    mint: PublicKey;
    style: any;
}): JSX.Element;
export declare function SwapButton(): JSX.Element;
