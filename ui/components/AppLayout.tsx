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

const AppLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDisconnectedModalOpen, setIsDisconnectedModalOpen] =
        React.useState(false);
    const [isConnectedModalOpen, setIsConnectedModalOpen] =
        React.useState(false);

    const { isLoggedIn, isLoginInProgress } = useMagic();

    if (isLoggedIn === undefined) {
        return <Loading />;
    }

    const { balance: tokenBalance, isLoading: isTokenBalanceLoading } =
        useSimpleAATokenBalance();

    const { balance: ethBalance, isLoading: isEthBalanceLoading } =
        useBalance();

    return (
        <Fragment>
            <div className="flex flex-col min-h-screen container mx-auto">
                <header className="p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Simple AA dApp</h1>
                    <div className="flex">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1">
                                    <span>{`${formatEther(
                                        tokenBalance ?? BigInt(0)
                                    )} SAT`}</span>
                                    <span>{`${formatEther(
                                        ethBalance ?? BigInt(0)
                                    )} ETH`}</span>
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
                            <Button
                                onClick={() => setIsDisconnectedModalOpen(true)}
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
                        )}
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-8 lg:p-12">{children}</main>
                <Toaster />
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
