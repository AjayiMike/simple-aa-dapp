import { useEffect, useState } from "react";
import { createPublicClient, http, PublicClient } from "viem";
import { sepolia } from "viem/chains";

const usePublicClient = () => {
    const [publicClient, setPublicClient] = useState<PublicClient>();

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_RPC_URL) return;
        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http(process.env.NEXT_PUBLIC_RPC_URL),
        });
        setPublicClient(publicClient);
    }, []);

    return publicClient;
};

export default usePublicClient;
