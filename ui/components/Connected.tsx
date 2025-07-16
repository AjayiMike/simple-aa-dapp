import React from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Copy, LogOut, CheckCircle } from "lucide-react";
import { useMagic } from "@/providers/MagicProvider";
import { shortenAddress } from "@/utils/common";

interface ConnectedProps {
    isOpen: boolean;
    handleClose: () => void;
}

const Connected: React.FC<ConnectedProps> = ({ isOpen, handleClose }) => {
    const { logout, user } = useMagic();

    const smartWalletAddress = "0x8765...4321";
    const smartWalletBalance = "4.56 ETH";

    if (!user) {
        return null;
    }

    return (
        <Sheet open={isOpen} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Account Details</SheetTitle>
                    <SheetDescription>
                        Here are your wallet and network details.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            Logged in as
                        </p>
                        <p className="font-semibold">{user.email}</p>
                    </div>
                    <div className="p-4 border rounded-lg space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Embedded Wallet
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="font-mono text-sm">
                                    {shortenAddress(
                                        user.publicAddress as string
                                    )}
                                </p>
                                <Button variant="ghost" size="icon">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm font-semibold">0.42 ETH</p>
                        </div>
                        <hr />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Smart Wallet
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="font-mono text-sm">
                                    {smartWalletAddress}
                                </p>
                                <Button variant="ghost" size="icon">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm font-semibold">
                                {smartWalletBalance}
                            </p>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Network
                            </p>
                            <p className="font-semibold">Sepolia Testnet</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                </div>
                <SheetFooter>
                    <Button
                        variant="destructive"
                        className="w-full flex items-center gap-1"
                        onClick={logout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default Connected;
