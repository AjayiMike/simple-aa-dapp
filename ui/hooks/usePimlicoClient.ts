import {
    createPimlicoClient,
    PimlicoClient,
} from "permissionless/clients/pimlico";
import { useEffect, useState } from "react";
import { http } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import usePublicClient from "./usePublicClient";

const usePimlicoClient = () => {
    const [pimlicoClient, setPimlicoClient] = useState<PimlicoClient>();
    const publicClient = usePublicClient();

    useEffect(() => {
        if (!publicClient) return;
        if (!process.env.NEXT_PUBLIC_PIMLICO_API_KEY) return;
        const pimlicoClient = createPimlicoClient({
            transport: http(
                `${process.env.NEXT_PUBLIC_PIMLICO_URL}?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
            ),
            entryPoint: {
                address: entryPoint07Address,
                version: "0.7",
            },
        });

        setPimlicoClient(pimlicoClient);
    }, [publicClient]);

    return pimlicoClient;
};

export default usePimlicoClient;
