"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORM_USDT_MARKET = exports.WORM_USDT_MINT = exports.WORM_USDC_MARKET = exports.WORM_USDC_MINT = exports.WORM_MARKET_BASE = exports.WRAPPED_SOL_MINT = exports.SOL_MINT = exports.USDT_MINT = exports.USDC_MINT = exports.SRM_MINT = exports.DEX_PID = void 0;
var web3_js_1 = require("@solana/web3.js");
exports.DEX_PID = new web3_js_1.PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
exports.SRM_MINT = new web3_js_1.PublicKey("SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt");
exports.USDC_MINT = new web3_js_1.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
exports.USDT_MINT = new web3_js_1.PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");
// Arbitrary mint to represent SOL (not wrapped SOL).
exports.SOL_MINT = new web3_js_1.PublicKey("Ejmc1UB4EsES5oAaRN63SpoxMJidt3ZGBrqrZk49vjTZ");
exports.WRAPPED_SOL_MINT = new web3_js_1.PublicKey("So11111111111111111111111111111111111111112");
exports.WORM_MARKET_BASE = new web3_js_1.PublicKey("6a9wpsZpZGxGhFVSQBpcTNjNjytdbSA1iUw1A5KNDxPw");
exports.WORM_USDC_MINT = new web3_js_1.PublicKey("FVsXUnbhifqJ4LiXQEbpUtXVdB8T5ADLKqSs5t1oc54F");
exports.WORM_USDC_MARKET = new web3_js_1.PublicKey("6nGMps9VfDjkKEwYjdSNqN1ToXkLae4VsN49fzBiDFBd");
exports.WORM_USDT_MINT = new web3_js_1.PublicKey("9w97GdWUYYaamGwdKMKZgGzPduZJkiFizq4rz5CPXRv2");
exports.WORM_USDT_MARKET = new web3_js_1.PublicKey("4v6e6vNXAaEunrvbqkYnKwbaWfck8a2KVR4uRAVXxVwC");
