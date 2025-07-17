import { SmartAccount, toCoinbaseSmartAccount } from "viem/account-abstraction";
import usePublicClient from "./usePublicClient";
import { useEffect, useState } from "react";
import { useMagic } from "@/providers/MagicProvider";
import useWalletClient from "./useWalletClient";

const useSmartAccount = () => {
    const [smartAccount, setSmartAccount] = useState<SmartAccount>();
    const publicClient = usePublicClient();
    const walletClient = useWalletClient();
    const magic = useMagic();
    useEffect(() => {
        if (
            !publicClient ||
            !walletClient?.account ||
            !magic.user?.publicAddress
        )
            return;
        toCoinbaseSmartAccount({
            client: publicClient,
            owners: [walletClient.account.address],
        }).then((account) => {
            setSmartAccount(account);
        });
    }, [publicClient, walletClient, magic.user?.publicAddress]);

    return smartAccount;
};

export default useSmartAccount;
