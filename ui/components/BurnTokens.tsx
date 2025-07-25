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
import useSendUserOperation from "@/hooks/useSendUserOperation";
import useSmartAccount from "@/hooks/useSmartAccount";
import useWalletClient from "@/hooks/useWalletClient";
import usePublicClient from "@/hooks/usePublicClient";
import { Address, parseEther } from "viem";
import { simpleAATokenAbi } from "@/abis";

export function BurnTokens() {
    const [amount, setAmount] = useState<string>("");
    const publicClient = usePublicClient();
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();
    const sendUserOperation = useSendUserOperation();

    const handleBurn = async () => {
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

            console.log("Sent user operation hash: ", userOperationHash);
        } catch (error) {
            console.error("Error sending user operation: ", error);
        }
    };
    return (
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
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleBurn}>Burn</Button>
            </CardFooter>
        </Card>
    );
}
