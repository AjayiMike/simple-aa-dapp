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
import { useState } from "react";
import usePublicClient from "@/hooks/usePublicClient";
import useSmartAccount from "@/hooks/useSmartAccount";
import useWalletClient from "@/hooks/useWalletClient";
import useSendUserOperation from "@/hooks/useSendUserOperation";
import { Address, parseEther } from "viem";
import { simpleAATokenAbi } from "@/abis";

export function TransferTokens() {
    const [recipientAddress, setRecipientAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const publicClient = usePublicClient();
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();
    const sendUserOperation = useSendUserOperation();

    const handleTransfer = async () => {
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
                    args: [recipientAddress, amountBigInt],
                },
            ]);

            console.log("Sent user operation hash: ", userOperationHash);
        } catch (error) {
            console.error("Error sending user operation: ", error);
        }
    };

    return (
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
                            onChange={(e) => setAmount(e.target.value)}
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
                <Button onClick={handleTransfer}>Transfer</Button>
            </CardFooter>
        </Card>
    );
}
