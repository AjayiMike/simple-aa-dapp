"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    userOperationHash: string;
}

export function SuccessModal({
    isOpen,
    onClose,
    userOperationHash,
}: SuccessModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Transaction Successful!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your transaction has been sent. You can view its status
                        on Blockscout.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4">
                    <p className="text-sm text-gray-500">
                        User Operation Hash:
                    </p>
                    <Link
                        href={`https://eth-sepolia.blockscout.com/op/${userOperationHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-all"
                    >
                        {userOperationHash}
                    </Link>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose}>
                        Close
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
