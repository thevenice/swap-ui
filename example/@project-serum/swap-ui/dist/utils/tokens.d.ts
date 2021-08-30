/// <reference types="node" />
import { AccountInfo as TokenAccount } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
export declare function getOwnedAssociatedTokenAccounts(connection: Connection, publicKey: PublicKey): Promise<(PublicKey | {
    publicKey: any;
    account: TokenAccount;
})[]>;
export declare function parseTokenAccountData(data: Buffer): TokenAccount;
