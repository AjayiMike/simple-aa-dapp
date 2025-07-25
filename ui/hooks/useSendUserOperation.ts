import { useCallback } from "react";
import { Abi, AbiItem, Address, encodeFunctionData, numberToHex } from "viem";
import useSmartAccount from "./useSmartAccount";
import { IUserOperation } from "@/types/account-abstraction";
import {
    getUserOperationGasPrice,
    getUserOperationSponsorshipData,
    getUserOpHash,
    sendUserOperation,
    signUserOpHash,
} from "@/utils/account-abstraction";
import { entryPointAddress } from "@/constants/config";
import useWalletClient from "./useWalletClient";

type SendUserOperationArgs = {
    contractAddress: Address;
    abi: Abi;
    functionName: string;
    args: any[];
};

const useSendUserOperation = () => {
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();

    return useCallback(
        async (calls: SendUserOperationArgs[]) => {
            if (!walletClient || !smartAccount || !smartAccount.address) {
                throw new Error("Wallet client or smart account not found");
            }
            const callData = calls.map((call) =>
                encodeFunctionData({
                    abi: call.abi,
                    functionName: call.functionName,
                    args: call.args,
                })
            );

            const userOpCallData = await smartAccount.encodeCalls(
                calls.map((call, index) => ({
                    to: call.contractAddress,
                    data: callData[index],
                }))
            );

            const nonce = await smartAccount.getNonce();
            const initCode = await smartAccount.getInitCode();

            const userOperation: Partial<IUserOperation> = {
                sender: smartAccount.address,
                nonce: numberToHex(nonce),
                initCode,
                callData: userOpCallData,
                signature: `0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c`, //dummy signature
            };

            const userOpGasPrice = await getUserOperationGasPrice(
                userOperation,
                entryPointAddress
            );

            userOperation.callGasLimit = userOpGasPrice.callGasLimit as any;
            userOperation.preVerificationGas =
                userOpGasPrice.preVerificationGas as any;
            userOperation.verificationGasLimit =
                userOpGasPrice.verificationGasLimit as any;

            const userOpSponsorshipData = await getUserOperationSponsorshipData(
                userOperation,
                entryPointAddress
            );

            userOperation.paymasterAndData =
                userOpSponsorshipData.paymasterAndData as any;
            userOperation.verificationGasLimit =
                userOpSponsorshipData.verificationGasLimit as any;
            userOperation.preVerificationGas =
                userOpSponsorshipData.preVerificationGas as any;
            userOperation.callGasLimit =
                userOpSponsorshipData.callGasLimit as any;

            userOperation.maxFeePerGas = userOpGasPrice.maxFeePerGas as any;
            userOperation.maxPriorityFeePerGas =
                userOpGasPrice.maxPriorityFeePerGas as any;

            const userOpHash = await getUserOpHash(
                userOperation,
                entryPointAddress,
                walletClient
            );

            const signature = await signUserOpHash(userOpHash, walletClient);

            userOperation.signature = signature;

            return await sendUserOperation(userOperation, entryPointAddress);
        },
        [walletClient, smartAccount?.address]
    );
};

export default useSendUserOperation;
