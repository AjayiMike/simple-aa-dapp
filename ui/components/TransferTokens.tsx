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

export function TransferTokens() {
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
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            placeholder="Amount of tokens to transfer"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Transfer</Button>
            </CardFooter>
        </Card>
    );
}
