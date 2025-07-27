"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import usePublicClient from "@/hooks/usePublicClient";
import useWalletClient from "@/hooks/useWalletClient";
import { Address, parseEther } from "viem";
import { simpleAATokenAbi } from "@/abis";
import useSmartAccount from "@/hooks/useSmartAccount";
import useSendUserOperation from "@/hooks/useSendUserOperation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SuccessModal } from "./SuccessModal";

export function MintTokens() {
    const [amount, setAmount] = useState<string>("");
    const publicClient = usePublicClient();
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();
    const sendUserOperation = useSendUserOperation();
    const [isMinting, setIsMinting] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [userOperationHash, setUserOperationHash] = useState<string>("");

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;
        if (regex.test(value)) {
            setAmount(value);
        }
    };

    const handleMint = async () => {
        setIsMinting(true);
        try {
            const amountBigInt = BigInt(parseEther(amount));
            if (
                !smartAccount.address ||
                !walletClient ||
                !publicClient ||
                !amountBigInt
            )
                return;

            const userOperationHash = await sendUserOperation([
                {
                    contractAddress: process.env
                        .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as Address,
                    abi: simpleAATokenAbi,
                    functionName: "mint",
                    args: [smartAccount.address, amountBigInt],
                },
            ]);
            setUserOperationHash(userOperationHash);
            setShowSuccessModal(true);
            setAmount("");
        } catch (error) {
            console.log("Error sending user operation: ", error);
            toast.error("Error minting tokens.");
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <>
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                userOperationHash={userOperationHash}
            />
            <Card>
                <CardHeader>
                    <CardTitle>Mint Tokens</CardTitle>
                    <CardDescription>
                        Create new tokens and add them to the total supply.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                placeholder="Amount of tokens to mint"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setAmount("")}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleMint}
                        disabled={isMinting}
                        className="flex items-center gap-1"
                    >
                        {isMinting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Minting...
                            </>
                        ) : (
                            "Mint"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
