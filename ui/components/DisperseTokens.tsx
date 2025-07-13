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

export function DisperseTokens() {
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
                            placeholder="0x...,100
0x...,200"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Disperse</Button>
            </CardFooter>
        </Card>
    );
}
