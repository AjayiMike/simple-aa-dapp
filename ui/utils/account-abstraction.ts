import { entryPointAbi, simpleAccountFactoryAbi } from "@/abis";
import {
    entryPointAddress,
    simpleAccountFactoryAddress,
} from "@/constants/config";
import { IUserOperation } from "@/types/account-abstraction";
import {
    Abi,
    Address,
    ContractFunctionExecutionErrorType,
    ContractFunctionRevertedErrorType,
    encodeAbiParameters,
    encodeFunctionData,
    Hex,
    keccak256,
    numberToHex,
    PublicClient,
    WalletClient,
} from "viem";
import { signMessage } from "viem/actions";
import {} from "viem/account-abstraction";

export const getSmartAccountAddress = async (
    initCode: Hex,
    publicClient: PublicClient
): Promise<Address> => {
    try {
        await publicClient.readContract({
            address: entryPointAddress,
            abi: entryPointAbi as Abi,
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
        abi: simpleAccountFactoryAbi,
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
    userOperation: Partial<IUserOperation>,
    entryPoint: Address
): Promise<{
    callGasLimit: Hex;
    preVerificationGas: Hex;
    verificationGasLimit: Hex;
    maxFeePerGas: Hex;
    maxPriorityFeePerGas: Hex;
}> => {
    const userOpPayload = {
        ...userOperation,
        nonce: numberToHex(userOperation.nonce!),
    };

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
                params: [userOpPayload, entryPoint],
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
    userOperation: Partial<IUserOperation>,
    entryPoint: Address
): Promise<{
    callGasLimit: Hex;
    paymasterAndData: Hex;
    preVerificationGas: Hex;
    verificationGasLimit: Hex;
}> => {
    const userOpPayload = {
        ...userOperation,
        nonce: numberToHex(userOperation.nonce!),
        callGasLimit: numberToHex(userOperation.callGasLimit!),
        verificationGasLimit: numberToHex(userOperation.verificationGasLimit!),
        preVerificationGas: numberToHex(userOperation.preVerificationGas!),
    };

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
                params: [userOpPayload, entryPoint],
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
    userOperation: IUserOperation,
    entryPoint: Address
): Promise<Hex> => {
    const userOpPayload = {
        ...userOperation,
        nonce: numberToHex(userOperation.nonce),
        callGasLimit: numberToHex(userOperation.callGasLimit),
        preVerificationGas: numberToHex(userOperation.preVerificationGas),
        verificationGasLimit: numberToHex(userOperation.verificationGasLimit),
        maxFeePerGas: numberToHex(userOperation.maxFeePerGas),
        maxPriorityFeePerGas: numberToHex(userOperation.maxPriorityFeePerGas),
    };

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
                params: [userOpPayload, entryPoint],
                id: 1,
            }),
        }
    );
    if (!response.ok) {
        throw new Error("Failed to send user operation");
    }
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message);
    }
    return data.result;
};

export const getUserOpHash = async (
    userOperation: Omit<IUserOperation, "signature">,
    entryPointAddress: Address,
    walletClient: WalletClient
) => {
    if (!walletClient.chain || !walletClient.account)
        throw new Error("Wallet client chain or account not found");
    const chainId = BigInt(walletClient.chain.id);
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
            userOperation.sender,
            userOperation.nonce,
            keccak256(userOperation.initCode),
            keccak256(userOperation.callData),
            userOperation.callGasLimit,
            userOperation.verificationGasLimit,
            userOperation.preVerificationGas,
            userOperation.maxFeePerGas,
            userOperation.maxPriorityFeePerGas,
            keccak256(userOperation.paymasterAndData ?? "0x"),
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
