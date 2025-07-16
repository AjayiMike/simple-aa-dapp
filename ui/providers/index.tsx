import { FC } from "react";
import AppQueryClientProvider from "./AppQueryClientProvider";
import MagicProvider from "./MagicProvider";

const AppProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AppQueryClientProvider>
            <MagicProvider>{children}</MagicProvider>
        </AppQueryClientProvider>
    );
};

export default AppProviders;
