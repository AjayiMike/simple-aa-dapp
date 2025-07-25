import { entryPointAbi } from "@/abis";
import {
    entryPointAddress,
    simpleAccountFactoryAddress,
} from "@/constants/config";
import {
    Address,
    ContractFunctionExecutionErrorType,
    ContractFunctionRevertedErrorType,
    encodeAbiParameters,
    encodeFunctionData,
    Hex,
    hexToBigInt,
    keccak256,
    PublicClient,
    WalletClient,
} from "viem";
import { signMessage } from "viem/actions";

export const getSmartAccountAddress = async (
    initCode: Hex,
    publicClient: PublicClient
): Promise<Address> => {
    try {
        await publicClient.readContract({
            address: entryPointAddress,
            abi: [
                {
                    inputs: [
                        {
                            internalType: "bytes",
                            name: "initCode",
                            type: "bytes",
                        },
                    ],
                    name: "getSenderAddress",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "sender",
                            type: "address",
                        },
                    ],
                    name: "SenderAddressResult",
                    type: "error",
                },
            ],
            functionName: "getSenderAddress",
            args: [initCode],
        });
    } catch (error) {
        const err = error as ContractFunctionExecutionErrorType;

        if (err.cause.name === "ContractFunctionRevertedError") {
            const revertError = err.cause as ContractFunctionRevertedErrorType;
            const errorName = revertError.data?.errorName ?? "";
            if (
                errorName === "SenderAddressResult" &&
                revertError.data?.args &&
                revertError.data?.args[0]
            ) {
                return revertError.data?.args[0] as Address;
            }
        }

        throw error;
    }
    throw new Error("Failed to get smart account address");
};

export const getIsSmartAccountDeployed = async (
    address: Address,
    publicClient: PublicClient
): Promise<boolean> => {
    const code = await publicClient?.getCode({
        address,
    });
    return code !== undefined;
};

export const getSmartAccountInitCode = async (owner: Address) => {
    const createAccountFunctionData = encodeFunctionData({
        abi: [
            {
                inputs: [
                    { name: "owner", type: "address" },
                    { name: "salt", type: "uint256" },
                ],
                name: "createAccount",
                outputs: [{ name: "ret", type: "address" }],
                stateMutability: "nonpayable",
                type: "function",
            },
        ],
        functionName: "createAccount",
        args: [owner, BigInt(0)],
    });
    return (simpleAccountFactoryAddress +
        createAccountFunctionData.substring(2)) as Hex;
};

export const getSmartAccountNonce = async (
    address: Address,
    publicClient: PublicClient
): Promise<bigint> => {
    return await publicClient.readContract({
        address: entryPointAddress,
        abi: entryPointAbi,
        functionName: "getNonce",
        args: [address, BigInt(0)],
    });
};

export const getUserOperationGasPrice = async (
    userOperation: any,
    entryPoint: any
): Promise<{
    callGasLimit: Hex;
    preVerificationGas: Hex;
    verificationGasLimit: Hex;
    maxFeePerGas: Hex;
    maxPriorityFeePerGas: Hex;
}> => {
    console.log({
        userOperation,
        entryPoint,
        r: process.env.NEXT_PUBLIC_BUNDLER_URL,
    });

    const response = await fetch(
        process.env.NEXT_PUBLIC_BUNDLER_URL as string,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "eth_estimateUserOperationGas",
                params: [userOperation, entryPoint],
                id: 1,
            }),
        }
    );
    if (!response.ok) {
        throw new Error("Failed to get user operation gas price");
    }
    const data = await response.json();
    return data.result;
};

export const getUserOperationSponsorshipData = async (
    userOperation: any,
    entryPoint: any
): Promise<{
    callGasLimit: Hex;
    paymasterAndData: Hex;
    preVerificationGas: Hex;
    verificationGasLimit: Hex;
}> => {
    const response = await fetch(
        process.env.NEXT_PUBLIC_PAYMASTER_URL as string,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "pm_sponsorUserOperation",
                params: [userOperation, entryPoint],
                id: 1,
            }),
        }
    );
    if (!response.ok) {
        throw new Error("Failed to get user operation gas sponsorship data");
    }
    const data = await response.json();
    return data.result;
};

export const sendUserOperation = async (
    userOperation: any,
    entryPoint: string
): Promise<Hex> => {
    const response = await fetch(
        process.env.NEXT_PUBLIC_BUNDLER_URL as string,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "eth_sendUserOperation",
                params: [userOperation, entryPoint],
                id: 1,
            }),
        }
    );
    if (!response.ok) {
        throw new Error("Failed to send user operation");
    }
    const data = await response.json();
    return data.result;
};

export const formatUserOperationForHashing = (userOperation: any) => {
    return {
        sender: userOperation.sender,
        nonce: hexToBigInt(userOperation.nonce),
        initCode: userOperation.initCode,
        callData: userOperation.callData,
        callGasLimit: hexToBigInt(userOperation.callGasLimit),
        verificationGasLimit: hexToBigInt(userOperation.verificationGasLimit),
        preVerificationGas: hexToBigInt(userOperation.preVerificationGas),
        maxFeePerGas: hexToBigInt(userOperation.maxFeePerGas),
        maxPriorityFeePerGas: hexToBigInt(userOperation.maxPriorityFeePerGas),
        paymasterAndData: userOperation.paymasterAndData,
    };
};

export const getUserOpHash = async (
    userOperation: any,
    entryPointAddress: Address,
    walletClient: WalletClient
) => {
    if (!walletClient.chain || !walletClient.account)
        throw new Error("Wallet client chain or account not found");
    const chainId = BigInt(walletClient.chain.id);
    const formattedUserOp = formatUserOperationForHashing(userOperation);
    const packedUserOp = encodeAbiParameters(
        [
            { type: "address" },
            { type: "uint256" },
            { type: "bytes32" },
            { type: "bytes32" },
            { type: "uint256" },
            { type: "uint256" },
            { type: "uint256" },
            { type: "uint256" },
            { type: "uint256" },
            { type: "bytes32" },
        ],
        [
            formattedUserOp.sender,
            formattedUserOp.nonce,
            keccak256(formattedUserOp.initCode),
            keccak256(formattedUserOp.callData),
            formattedUserOp.callGasLimit,
            formattedUserOp.verificationGasLimit,
            formattedUserOp.preVerificationGas,
            formattedUserOp.maxFeePerGas,
            formattedUserOp.maxPriorityFeePerGas,
            keccak256(formattedUserOp.paymasterAndData),
        ]
    );
    return keccak256(
        encodeAbiParameters(
            [{ type: "bytes32" }, { type: "address" }, { type: "uint256" }],
            [keccak256(packedUserOp), entryPointAddress, chainId]
        )
    );
};

export const signUserOpHash = async (
    userOpHash: Hex,
    signerWalletClient: WalletClient
) => {
    if (!signerWalletClient || !signerWalletClient.account)
        throw new Error("Signer wallet client or account not found");

    const signature = await signMessage(signerWalletClient, {
        account: signerWalletClient.account,
        message: { raw: userOpHash },
    });

    return signature;
};
