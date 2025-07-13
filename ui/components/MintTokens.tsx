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

export function MintTokens() {
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
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Mint</Button>
            </CardFooter>
        </Card>
    );
}
