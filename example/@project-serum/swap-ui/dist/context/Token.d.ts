/// <reference types="react" />
import { Provider } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { MintInfo, AccountInfo as TokenAccount } from "@solana/spl-token";
export declare type TokenContext = {
    provider: Provider;
};
export declare function TokenContextProvider(props: any): JSX.Element;
export declare function useOwnedTokenAccount(mint?: PublicKey): {
    publicKey: PublicKey;
    account: TokenAccount;
} | null | undefined;
export declare function useMint(mint?: PublicKey): MintInfo | undefined | null;
export declare function setMintCache(pk: PublicKey, account: MintInfo): void;
