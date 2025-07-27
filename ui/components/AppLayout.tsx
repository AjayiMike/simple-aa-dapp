"use client";

import React, { FC, Fragment } from "react";
import { Button } from "./ui/button";
import { Loader2, LogIn, User } from "lucide-react";
import Disconnected from "./Disconnected";
import { useMagic } from "@/providers/MagicProvider";
import { Toaster } from "./ui/sonner";
import Connected from "./Connected";
import Loading from "./Loading";
import { useSimpleAATokenBalance } from "@/hooks/useSimpleAATokenBalance";
import useBalance from "@/hooks/useBalance";
import { formatEther } from "viem";
import useGasSponsorship from "@/hooks/useGasSponsorship";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const AppLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDisconnectedModalOpen, setIsDisconnectedModalOpen] =
        React.useState(false);
    const [isConnectedModalOpen, setIsConnectedModalOpen] =
        React.useState(false);

    const { isLoggedIn, isLoginInProgress } = useMagic();

    const { balance: tokenBalance } = useSimpleAATokenBalance();

    const { balance: ethBalance } = useBalance();

    const { gasSponsorship, toggleGasSponsorship } = useGasSponsorship();

    if (isLoggedIn === undefined) {
        return <Loading />;
    }

    return (
        <Fragment>
            <Toaster />
            <div className="flex flex-col min-h-screen container mx-auto">
                <header className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <h1 className="text-xl font-semibold whitespace-nowrap">
                        Simple AA dApp
                    </h1>
                    <div className="flex justify-start md:justify-end w-full">
                        {isLoggedIn ? (
                            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                                <div className="flex items-center gap-2">
                                    <span>{`${formatEther(
                                        tokenBalance ?? BigInt(0)
                                    )} SAT`}</span>
                                    <span>{`${formatEther(
                                        ethBalance ?? BigInt(0)
                                    )} ETH`}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="gas-sponsorship"
                                        checked={gasSponsorship}
                                        onCheckedChange={toggleGasSponsorship}
                                    />
                                    <Label htmlFor="gas-sponsorship">
                                        Gas Sponsorship
                                    </Label>
                                </div>
                                <Button
                                    onClick={() =>
                                        setIsConnectedModalOpen(true)
                                    }
                                    className="flex items-center gap-1"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Account</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex justify-end w-full">
                                <Button
                                    onClick={() =>
                                        setIsDisconnectedModalOpen(true)
                                    }
                                    className="flex items-center gap-1"
                                    disabled={isLoginInProgress}
                                >
                                    {isLoginInProgress ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogIn className="mr-2 h-4 w-4" />
                                    )}
                                    <span>Connect</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-8 lg:p-12">{children}</main>
                <Disconnected
                    isOpen={isDisconnectedModalOpen}
                    handleClose={() => setIsDisconnectedModalOpen(false)}
                />
                <Connected
                    isOpen={isConnectedModalOpen}
                    handleClose={() => setIsConnectedModalOpen(false)}
                />
            </div>
        </Fragment>
    );
};

export default AppLayout;
