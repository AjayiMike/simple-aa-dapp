import { toSafeSmartAccount } from "permissionless/accounts";
import { entryPoint07Address, SmartAccount } from "viem/account-abstraction";
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
        if (!publicClient || !walletClient || !magic.user?.publicAddress)
            return;
        toSafeSmartAccount({
            client: publicClient,
            owners: [walletClient],
            entryPoint: {
                address: entryPoint07Address,
                version: "0.7",
            },
            version: "1.4.1",
        }).then((account) => {
            setSmartAccount(account);
        });
    }, [publicClient, walletClient, magic.user?.publicAddress]);

    return smartAccount;
};

export default useSmartAccount;
