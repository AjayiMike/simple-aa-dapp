import { useCallback } from "react";
import { Abi, Address, encodeFunctionData, hexToBigInt } from "viem";
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
import useGasSponsorship from "./useGasSponsorship";

type SendUserOperationArgs = {
    contractAddress: Address;
    abi: Abi;
    functionName: string;
    args: unknown[];
};

const useSendUserOperation = () => {
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();
    const { gasSponsorship: isGasSponsorshipEnabled } = useGasSponsorship();

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
                nonce: nonce,
                initCode,
                callData: userOpCallData,
                signature: `0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c`, //dummy signature
            };

            const userOpGasPrice = await getUserOperationGasPrice(
                userOperation,
                entryPointAddress
            );

            userOperation.callGasLimit = hexToBigInt(
                userOpGasPrice.callGasLimit
            );
            userOperation.preVerificationGas = hexToBigInt(
                userOpGasPrice.preVerificationGas
            );
            userOperation.verificationGasLimit = hexToBigInt(
                userOpGasPrice.verificationGasLimit
            );

            if (isGasSponsorshipEnabled) {
                const userOpSponsorshipData =
                    await getUserOperationSponsorshipData(
                        userOperation,
                        entryPointAddress
                    );

                userOperation.paymasterAndData =
                    userOpSponsorshipData.paymasterAndData;
                userOperation.verificationGasLimit = hexToBigInt(
                    userOpSponsorshipData.verificationGasLimit
                );
                userOperation.preVerificationGas = hexToBigInt(
                    userOpSponsorshipData.preVerificationGas
                );
                userOperation.callGasLimit = hexToBigInt(
                    userOpSponsorshipData.callGasLimit
                );

                userOperation.maxFeePerGas = hexToBigInt(
                    userOpGasPrice.maxFeePerGas
                );
                userOperation.maxPriorityFeePerGas = hexToBigInt(
                    userOpGasPrice.maxPriorityFeePerGas
                );
            } else {
                userOperation.maxFeePerGas = hexToBigInt(
                    userOpGasPrice?.maxFeePerGas
                );
                userOperation.maxPriorityFeePerGas = hexToBigInt(
                    userOpGasPrice?.maxPriorityFeePerGas
                );
                userOperation.paymasterAndData = "0x";
            }

            const userOpHash = await getUserOpHash(
                userOperation as Omit<IUserOperation, "signature">,
                entryPointAddress,
                walletClient
            );

            const signature = await signUserOpHash(userOpHash, walletClient);

            userOperation.signature = signature;

            return await sendUserOperation(
                userOperation as IUserOperation,
                entryPointAddress
            );
        },
        [walletClient, smartAccount, isGasSponsorshipEnabled]
    );
};

export default useSendUserOperation;
