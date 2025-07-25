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
import useWalletClient from "@/hooks/useWalletClient";
import { Address, parseEther } from "viem";
import { simpleAATokenAbi } from "@/abis";
import useSmartAccount from "@/hooks/useSmartAccount";
import useSendUserOperation from "@/hooks/useSendUserOperation";

export function MintTokens() {
    const [amount, setAmount] = useState<string>("");
    const publicClient = usePublicClient();
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();
    const sendUserOperation = useSendUserOperation();

    const handleMint = async () => {
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

            console.log("Sent user operation hash: ", userOperationHash);
        } catch (error) {
            console.error("Error sending user operation: ", error);
        }
    };

    return (
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
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleMint}>Mint</Button>
            </CardFooter>
        </Card>
    );
}
