import { useQuery } from "@tanstack/react-query";
import { Address, formatEther } from "viem";
import usePublicClient from "./usePublicClient";

const useBalance = (account?: string) => {
    const publicClient = usePublicClient();

    const {
        data: balance,
        isLoading,
        isFetching,
        isRefetching,
        isError,
        error,
    } = useQuery({
        queryKey: ["ETHBalance", account],
        queryFn: async () => {
            if (!account) return BigInt(0);
            return publicClient?.getBalance({
                address: account as Address,
            });
        },
        enabled: !!account && !!publicClient,
        refetchInterval: 4000,
    });

    return {
        balance,
        formattedBalance: formatEther(balance ?? BigInt(0)),
        // Loading states
        isLoading, // True when fetching for the first time with no data yet
        isFetching, // True whenever a fetch is in progress
        isRefetching, // True when refetching data that already exists
        isError, // True if there was an error fetching the balance
        error, // The error object if an error occurred
    };
};

export default useBalance;
