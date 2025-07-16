import React from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useMagic } from "@/providers/MagicProvider";
import { Loader2 } from "lucide-react";

interface DisconnectedProps {
    isOpen: boolean;
    handleClose: () => void;
}

const Disconnected: React.FC<DisconnectedProps> = ({ isOpen, handleClose }) => {
    const { login, isLoginInProgress } = useMagic();
    return (
        <Sheet open={isOpen} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>You are disconnected</SheetTitle>
                    <SheetDescription>
                        Connect your wallet to get started.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <Button
                        className="w-full flex items-center gap-1"
                        onClick={login}
                        disabled={isLoginInProgress}
                    >
                        {isLoginInProgress ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.75 8.36,4.73 12.19,4.73C15.28,4.73 17.27,6.73 18.1,7.5L20.25,5.85C18.32,4.06 15.82,2.91 12.19,2.91C6.94,2.91 3,7.5 3,12C3,16.5 6.94,21.09 12.19,21.09C17.6,21.09 21.54,16.88 21.54,12.29C21.54,11.77 21.48,11.44 21.35,11.1Z"
                                />
                            </svg>
                        )}
                        <span>Connect with Google</span>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Disconnected;
