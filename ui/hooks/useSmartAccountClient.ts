import {
    createSmartAccountClient,
    SmartAccountClient,
} from "permissionless/clients";
import React, { useEffect, useState } from "react";
import useSmartAccount from "./useSmartAccount";
import { sepolia } from "viem/chains";
import { http } from "viem";
import usePimlicoClient from "./usePimlicoClient";

const useSmartAccountClient = () => {
    const [smartAccountClient, setSmartAccountClient] =
        useState<SmartAccountClient>();
    const account = useSmartAccount();
    const pimlicoClient = usePimlicoClient();

    useEffect(() => {
        if (!account || !pimlicoClient) return;
        const smartAccountClient = createSmartAccountClient({
            account,
            chain: sepolia,
            bundlerTransport: http(
                `${process.env.NEXT_PUBLIC_PIMLICO_URL}?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
            ),
            paymaster: pimlicoClient,
            userOperation: {
                estimateFeesPerGas: async () => {
                    return (await pimlicoClient.getUserOperationGasPrice())
                        .fast;
                },
            },
        });
        setSmartAccountClient(smartAccountClient);
    }, [account, pimlicoClient]);

    return smartAccountClient;
};

export default useSmartAccountClient;
