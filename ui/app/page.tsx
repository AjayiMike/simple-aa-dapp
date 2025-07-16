"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MintTokens } from "@/components/MintTokens";
import { TransferTokens } from "@/components/TransferTokens";
import { DisperseTokens } from "@/components/DisperseTokens";
import { BurnTokens } from "@/components/BurnTokens";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center">
            <Tabs
                defaultValue="mint"
                className="w-full max-w-lg rounded-lg border shadow-lg"
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="mint">Mint</TabsTrigger>
                    <TabsTrigger value="transfer">Transfer</TabsTrigger>
                    <TabsTrigger value="disperse">Disperse</TabsTrigger>
                    <TabsTrigger value="burn">Burn</TabsTrigger>
                </TabsList>
                <TabsContent value="mint">
                    <MintTokens />
                </TabsContent>
                <TabsContent value="transfer">
                    <TransferTokens />
                </TabsContent>
                <TabsContent value="disperse">
                    <DisperseTokens />
                </TabsContent>
                <TabsContent value="burn">
                    <BurnTokens />
                </TabsContent>
            </Tabs>
        </div>
    );
}
