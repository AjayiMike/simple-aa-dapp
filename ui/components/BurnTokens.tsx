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
import useSendUserOperation from "@/hooks/useSendUserOperation";
import useSmartAccount from "@/hooks/useSmartAccount";
import useWalletClient from "@/hooks/useWalletClient";
import usePublicClient from "@/hooks/usePublicClient";
import { Address, parseEther } from "viem";
import { simpleAATokenAbi } from "@/abis";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SuccessModal } from "./SuccessModal";

export function BurnTokens() {
    const [amount, setAmount] = useState<string>("");
    const publicClient = usePublicClient();
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();
    const sendUserOperation = useSendUserOperation();
    const [isBurning, setIsBurning] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [userOperationHash, setUserOperationHash] = useState<string>("");

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;
        if (regex.test(value)) {
            setAmount(value);
        }
    };

    const handleBurn = async () => {
        setIsBurning(true);
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
                    functionName: "burn",
                    args: [amountBigInt],
                },
            ]);
            setUserOperationHash(userOperationHash);
            setShowSuccessModal(true);
            setAmount("");
        } catch (error: unknown) {
            console.log("Error sending user operation: ", error);
            if (
                error instanceof Error &&
                error.message.includes("AA21 didn't pay prefund")
            ) {
                toast.error(
                    "Error burning tokens. Insufficient balance to pay for the user operation. Consider enabling gas sponsorship."
                );
                return;
            }
            toast.error(`Error burning tokens: ${error}`);
        } finally {
            setIsBurning(false);
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
                    <CardTitle>Burn Tokens</CardTitle>
                    <CardDescription>
                        Permanently remove tokens from the total supply.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                placeholder="Amount of tokens to burn"
                                value={amount}
                                onChange={handleAmountChange}
                                className="text-xs sm:text-sm md:text-base"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setAmount("")}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBurn}
                        disabled={isBurning}
                        className="flex items-center gap-1"
                    >
                        {isBurning ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Burning...
                            </>
                        ) : (
                            "Burn"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
