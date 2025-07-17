import { useEffect, useState } from "react";
import { http } from "viem";
import { BundlerClient, createBundlerClient } from "viem/account-abstraction";
import usePublicClient from "./usePublicClient";
import useSmartAccount from "./useSmartAccount";

const useBundlerClient = () => {
    const [bundlerClient, setBundlerClient] = useState<BundlerClient>();
    const publicClient = usePublicClient();
    const account = useSmartAccount();

    useEffect(() => {
        if (!publicClient) return;
        if (!process.env.NEXT_PUBLIC_PIMLICO_API_KEY) return;
        const bundlerClient = createBundlerClient({
            client: publicClient,
            account,
            paymaster: true, // Bundler also accepts Paymaster sponsorship, otherwise we pass a custom paymaster client
            transport: http(
                `${process.env.NEXT_PUBLIC_PIMLICO_URL}?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
            ),
        });

        setBundlerClient(bundlerClient);
    }, [publicClient, account]);

    return bundlerClient;
};

export default useBundlerClient;
