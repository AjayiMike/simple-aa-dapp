import { Address } from "viem";
import useSmartAccount from "./useSmartAccount";
import usePublicClient from "./usePublicClient";
import { useQuery } from "@tanstack/react-query";
import { simpleAATokenAbi } from "@/abis";
import { useEffect } from "react";

export function useSimpleAATokenBalance() {
    const { address } = useSmartAccount();
    const client = usePublicClient();

    // Single token balance fetch
    const singleTokenQuery = useQuery<bigint>({
        queryKey: ["tokenBalance", address],
        queryFn: async () => {
            if (!address || !client) return BigInt(0);
            try {
                return (await client.readContract({
                    address: process.env
                        .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as Address,
                    abi: simpleAATokenAbi,
                    functionName: "balanceOf",
                    args: [address as Address],
                })) as bigint;
            } catch (error) {
                console.log("Error fetching token balance:", error);
                return BigInt(0);
            }
        },
        enabled: !!address && !!client,
        refetchInterval: 4000,
    });

    // Set up Transfer event watching for balance updates
    useEffect(() => {
        if (!address || !client) return;

        const unsubscribeFromTransfer = client.watchContractEvent({
            address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as Address,
            abi: simpleAATokenAbi,
            eventName: "Transfer",
            args: { from: address as Address },
            onLogs: () => singleTokenQuery.refetch(),
        });

        const unsubscribeToTransfer = client.watchContractEvent({
            address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as Address,
            abi: simpleAATokenAbi,
            eventName: "Transfer",
            args: { to: address as Address },
            onLogs: () => singleTokenQuery.refetch(),
        });

        return () => {
            unsubscribeFromTransfer();
            unsubscribeToTransfer();
        };
    }, [address, client, singleTokenQuery.refetch, singleTokenQuery]);

    return {
        balance: singleTokenQuery.data ?? BigInt(0),
        isLoading: singleTokenQuery.isLoading,
        refetch: singleTokenQuery.refetch,
    };
}
