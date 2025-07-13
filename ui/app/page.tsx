import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MintTokens } from "@/components/MintTokens";
import { TransferTokens } from "@/components/TransferTokens";
import { DisperseTokens } from "@/components/DisperseTokens";
import { BurnTokens } from "@/components/BurnTokens";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12">
      <Tabs defaultValue="mint" className="w-full max-w-lg">
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
    </main>
  );
}
