/// <reference types="react" />
import { PublicKey } from "@solana/web3.js";
export default function TokenDialog({ open, onClose, setMint, }: {
    open: boolean;
    onClose: () => void;
    setMint: (mint: PublicKey) => void;
}): JSX.Element;
