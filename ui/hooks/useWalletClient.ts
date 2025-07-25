import { useMagic } from "@/providers/MagicProvider";
import { useEffect, useState } from "react";
import {
    Account,
    Chain,
    createWalletClient,
    custom,
    Hex,
    Transport,
    WalletClient,
} from "viem";
import { sepolia } from "viem/chains";

const useWalletClient = () => {
    const [walletClient, setWalletClient] =
        useState<WalletClient<Transport, Chain | undefined, Account>>();
    const magic = useMagic();

    useEffect(() => {
        if (!magic.magic?.rpcProvider || !magic.user?.publicAddress) return;
        const walletClient = createWalletClient({
            chain: sepolia,
            account: magic.user?.publicAddress as Hex,
            transport: custom(magic.magic.rpcProvider as any),
        });
        setWalletClient(walletClient);
    }, [magic.magic?.rpcProvider, magic.user?.publicAddress]);

    return walletClient;
};

export default useWalletClient;
