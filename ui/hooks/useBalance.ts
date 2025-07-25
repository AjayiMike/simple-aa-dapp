import { useQuery } from "@tanstack/react-query";
import { Address, formatEther } from "viem";
import usePublicClient from "./usePublicClient";
import useSmartAccount from "./useSmartAccount";

const useBalance = () => {
    const { address } = useSmartAccount();
    const publicClient = usePublicClient();

    const {
        data: balance,
        isLoading,
        isFetching,
        isRefetching,
        isError,
        error,
    } = useQuery({
        queryKey: ["ETHBalance", address],
        queryFn: async () => {
            if (!address) return BigInt(0);
            return publicClient?.getBalance({
                address: address as Address,
            });
        },
        enabled: !!address && !!publicClient,
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
