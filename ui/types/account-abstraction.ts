import { Address, Hex } from "viem";

// entrypoint v0.6 user operation type
export interface IUserOperation {
    sender: Address;
    nonce: bigint;
    initCode: Hex;
    callData: Hex;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
    paymasterAndData: Hex;
    signature: Hex;
}
