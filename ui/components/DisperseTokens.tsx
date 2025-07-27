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
import { Address, isAddress, parseEther } from "viem";
import { simpleAATokenAbi } from "@/abis";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SuccessModal } from "./SuccessModal";

export function DisperseTokens() {
    const [inputValue, setInputValue] = useState<string>("");
    const publicClient = usePublicClient();
    const smartAccount = useSmartAccount();
    const walletClient = useWalletClient();
    const sendUserOperation = useSendUserOperation();
    const [isDispersing, setIsDispersing] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [userOperationHash, setUserOperationHash] = useState<string>("");

    const handleDisperse = async () => {
        setIsDispersing(true);
        try {
            const lines = inputValue
                .split("\n")
                .filter((line) => line.trim() !== "");
            const addresses: Address[] = [];
            const amounts: bigint[] = [];

            for (let i = 0; i < lines.length; i++) {
                const [address, amountStr] = lines[i].split(",");
                if (!address || !amountStr) {
                    toast.error(
                        `Line ${i + 1}: Invalid format. Use 'address,amount'.`
                    );
                    setIsDispersing(false);
                    return;
                }
                if (!isAddress(address.trim())) {
                    toast.error(`Line ${i + 1}: Invalid address.`);
                    setIsDispersing(false);
                    return;
                }
                try {
                    const amount = parseEther(amountStr.trim());
                    if (amount <= BigInt(0)) {
                        toast.error(`Line ${i + 1}: Amount must be positive.`);
                        setIsDispersing(false);
                        return;
                    }
                    addresses.push(address.trim() as Address);
                    amounts.push(amount);
                } catch (error) {
                    console.log("Error parsing amount: ", error);
                    toast.error(`Line ${i + 1}: Invalid amount.`);
                    setIsDispersing(false);
                    return;
                }
            }

            if (
                !smartAccount.address ||
                !walletClient ||
                !publicClient ||
                !addresses.length
            ) {
                setIsDispersing(false);
                return;
            }

            const calls = addresses.map((address, index) => ({
                contractAddress: process.env
                    .NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as Address,
                abi: simpleAATokenAbi,
                functionName: "transfer",
                args: [address, amounts[index]],
            }));

            const userOperationHash = await sendUserOperation(calls);

            setUserOperationHash(userOperationHash);
            setShowSuccessModal(true);
            setInputValue("");
        } catch (error: unknown) {
            console.log("Error sending user operation: ", error);
            if (
                error instanceof Error &&
                error.message.includes("AA21 didn't pay prefund")
            ) {
                toast.error(
                    "Error dispersing tokens. Insufficient balance to pay for the user operation."
                );
                return;
            }
            toast.error(`Error dispersing tokens: ${error}`);
        } finally {
            setIsDispersing(false);
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
                    <CardTitle>Disperse Tokens</CardTitle>
                    <CardDescription>
                        Send tokens to multiple addresses at once. Enter one
                        address and amount per line, separated by a comma.
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
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setInputValue("")}
                        disabled={isDispersing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDisperse}
                        disabled={isDispersing}
                        className="flex items-center gap-1"
                    >
                        {isDispersing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Dispersing...
                            </>
                        ) : (
                            "Disperse"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
