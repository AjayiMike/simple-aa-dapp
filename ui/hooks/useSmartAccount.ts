import usePublicClient from "./usePublicClient";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMagic } from "@/providers/MagicProvider";
import useWalletClient from "./useWalletClient";
import { Address, Call, encodeFunctionData } from "viem";
import {
    getIsSmartAccountDeployed,
    getSmartAccountAddress,
    getSmartAccountInitCode,
    getSmartAccountNonce,
} from "@/utils/account-abstraction";
import { simpleAccountAbi } from "@/abis";

const useSmartAccount = () => {
    const [address, setAddress] = useState<Address>();
    const publicClient = usePublicClient();
    const walletClient = useWalletClient();
    const magic = useMagic();

    useEffect(() => {
        (async () => {
            if (!magic.user?.publicAddress || !publicClient) return;

            const initCode = await getSmartAccountInitCode(
                magic.user?.publicAddress as Address
            );

            const smartAccountAddress = await getSmartAccountAddress(
                initCode,
                publicClient
            );

            console.log("smartAccountAddress", smartAccountAddress);
            setAddress(smartAccountAddress);
        })();
    }, [publicClient, walletClient, magic.user?.publicAddress]);

    const isDeployed = useCallback(async () => {
        if (!address || !publicClient) {
            throw new Error("Smart account address or public client not found");
        }
        return await getIsSmartAccountDeployed(address, publicClient);
    }, [address, publicClient]);

    const getInitCode = useCallback(async () => {
        if (!magic.user?.publicAddress || !publicClient) {
            throw new Error(
                "Magic user public address or public client not found"
            );
        }
        if (await isDeployed()) return "0x";
        return await getSmartAccountInitCode(
            magic.user?.publicAddress as Address
        );
    }, [magic.user?.publicAddress, publicClient, isDeployed]);

    const getNonce = useCallback(async () => {
        if (!address || !publicClient) {
            throw new Error("Smart account address or public client not found");
        }
        return await getSmartAccountNonce(address, publicClient);
    }, [address, publicClient]);

    const encodeCalls = useCallback(
        async (calls: Call[]) => {
            if (!address || !publicClient) {
                throw new Error(
                    "Smart account address or public client not found"
                );
            }
            if (calls.length === 1)
                return encodeFunctionData({
                    abi: simpleAccountAbi,
                    functionName: "execute",
                    args: [
                        calls[0].to,
                        calls[0].value ?? BigInt(0),
                        calls[0].data ?? "0x",
                    ],
                });
            console.log("Calls zzzz: ", calls);
            return encodeFunctionData({
                abi: simpleAccountAbi,
                functionName: "executeBatch",
                args: [
                    calls.map((call) => call.to),
                    calls.map((call) => call.data),
                ],
            });
        },
        [address, publicClient]
    );

    return useMemo(
        () => ({
            address,
            isDeployed,
            getInitCode,
            getNonce,
            encodeCalls,
        }),
        [address, isDeployed, getInitCode, getNonce, encodeCalls]
    );
};

export default useSmartAccount;
