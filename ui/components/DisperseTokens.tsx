"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import useSendUserOperation from "@/hooks/useSendUserOperation";
import useWalletClient from "@/hooks/useWalletClient";
import useSmartAccount from "@/hooks/useSmartAccount";
import usePublicClient from "@/hooks/usePublicClient";
import { Address, parseEther } from "viem";
import { simpleAATokenAbi } from "@/abis";

export function DisperseTokens() {
    const [addressesAndAmounts, setAddressesAndAmounts] = useState<
        [string, string][]
    >([]);
    const publicClient = usePublicClient();
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();
    const sendUserOperation = useSendUserOperation();

    const handleDisperse = async () => {
        try {
            const addresses = addressesAndAmounts.map(([address]) => address);
            const amounts = addressesAndAmounts.map(([, amount]) =>
                BigInt(parseEther(amount))
            );
            if (
                !smartAccount.address ||
                !walletClient ||
                !publicClient ||
                !addresses.length ||
                !amounts.length
            )
                return;

            const calls = addresses.map((address, index) => ({
                contractAddress: process.env
                    .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as Address,
                abi: simpleAATokenAbi,
                functionName: "transfer",
                args: [address, amounts[index]],
            }));

            console.log("Calls: ", calls);

            const userOperationHash = await sendUserOperation(calls);

            console.log("Sent user operation hash: ", userOperationHash);
        } catch (error) {
            console.error("Error sending user operation: ", error);
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Disperse Tokens</CardTitle>
                <CardDescription>
                    Send tokens to multiple addresses at once. Enter one address
                    and amount per line, separated by a comma.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="disperse-data">
                            Addresses and Amounts
                        </Label>
                        <Textarea
                            id="disperse-data"
                            placeholder="0x...,100,
0x...,200"
                            value={addressesAndAmounts
                                .map(
                                    ([address, amount]) =>
                                        `${address},${amount}`
                                )
                                .join("\n")}
                            onChange={(e) => {
                                const lines = e.target.value.split("\n");
                                setAddressesAndAmounts(
                                    lines.map(
                                        (line) =>
                                            line.split(",") as [string, string]
                                    )
                                );
                            }}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setAddressesAndAmounts([])}
                >
                    Cancel
                </Button>
                <Button onClick={handleDisperse}>Disperse</Button>
            </CardFooter>
        </Card>
    );
}
