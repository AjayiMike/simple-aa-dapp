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
import useSmartAccount from "@/hooks/useSmartAccount";
import useWalletClient from "@/hooks/useWalletClient";
import useSendUserOperation from "@/hooks/useSendUserOperation";
import { Address, isAddress, parseEther } from "viem";
import { simpleAATokenAbi } from "@/abis";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SuccessModal } from "./SuccessModal";

export function TransferTokens() {
    const [recipientAddress, setRecipientAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const publicClient = usePublicClient();
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();
    const sendUserOperation = useSendUserOperation();
    const [isTransferring, setIsTransferring] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [userOperationHash, setUserOperationHash] = useState<string>("");

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;
        if (regex.test(value)) {
            setAmount(value);
        }
    };

    const handleTransfer = async () => {
        if (!isAddress(recipientAddress)) {
            toast.error("Invalid recipient address.");
            return;
        }

        setIsTransferring(true);
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
                    functionName: "transfer",
                    args: [recipientAddress as Address, amountBigInt],
                },
            ]);

            console.log("Sent user operation hash: ", userOperationHash);
            setUserOperationHash(userOperationHash);
            setShowSuccessModal(true);
            setRecipientAddress("");
            setAmount("");
        } catch (error) {
            console.error("Error sending user operation: ", error);
            toast.error("Error transferring tokens.");
        } finally {
            setIsTransferring(false);
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
                    <CardTitle>Transfer Tokens</CardTitle>
                    <CardDescription>
                        Send tokens to another address.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="address">Recipient Address</Label>
                            <Input
                                id="address"
                                placeholder="Address of the recipient"
                                value={recipientAddress}
                                onChange={(e) =>
                                    setRecipientAddress(e.target.value)
                                }
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                placeholder="Amount of tokens to transfer"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setRecipientAddress("");
                            setAmount("");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleTransfer}
                        disabled={isTransferring}
                        className="flex items-center gap-1"
                    >
                        {isTransferring ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Transferring...
                            </>
                        ) : (
                            "Transfer"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
