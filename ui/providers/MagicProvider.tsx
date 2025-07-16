"use client";
import { OAuthExtension } from "@magic-ext/oauth2";
import {
    Magic as MagicBase,
    MagicUserMetadata,
    RPCError,
    RPCErrorCode,
} from "magic-sdk";
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";

export type Magic = MagicBase<OAuthExtension[]>;

type MagicContextType = {
    magic: Magic | null;
    isLoginInProgress: boolean;
    isLoggedIn: boolean;
    user: MagicUserMetadata | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

const MagicContext = createContext<MagicContextType>({
    magic: null,
    isLoginInProgress: false,
    isLoggedIn: false,
    user: null,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

export const useMagic = () => {
    const context = useContext(MagicContext);
    if (!context) {
        throw new Error("useMagic must be used within a MagicProvider");
    }
    return context;
};

const MagicProvider = ({ children }: { children: ReactNode }) => {
    const [magic, setMagic] = useState<Magic | null>(null);
    const [isLoginInProgress, setLoginInProgress] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<MagicUserMetadata | null>(null);

    useEffect(() => {
        if (magic) {
            magic.user
                .isLoggedIn()
                .then((isLoggedIn) => {
                    if (isLoggedIn) {
                        magic.user.getInfo().then((info) => {
                            setUser(info);
                            setIsLoggedIn(isLoggedIn);
                        });
                    }
                })
                .finally(() => {
                    setLoginInProgress(false);
                });
        }
    }, [magic]);

    const initiateLogin = useCallback(async () => {
        try {
            if (!magic || isLoginInProgress || isLoggedIn) return;
            setLoginInProgress(true);
            localStorage.setItem("login-in-progress", "true");
            await magic.oauth2.loginWithRedirect({
                provider: "google",
                redirectURI: new URL(window.location.origin).href,
            });
        } catch (e) {
            localStorage.removeItem("login-in-progress");
            if (e instanceof RPCError) {
                switch (e.code) {
                    case RPCErrorCode.MagicLinkFailedVerification:
                    case RPCErrorCode.MagicLinkExpired:
                    case RPCErrorCode.MagicLinkRateLimited:
                    case RPCErrorCode.UserAlreadyLoggedIn:
                        toast.error(e.message);
                        break;
                    default:
                        toast.error("Something went wrong. Please try again");
                }
            }
        } finally {
            setLoginInProgress(false);
        }
    }, [isLoggedIn, isLoginInProgress, magic]);

    const finalizeLogin = useCallback(async () => {
        try {
            const loginInProgress = localStorage.getItem("login-in-progress");
            if (loginInProgress !== "true") return;
            setLoginInProgress(true);
            const result = await magic?.oauth2.getRedirectResult({});
            if (!result) {
                toast.error("Error logging in. Try again");
                return;
            }
            setUser(result.magic.userMetadata);
            setIsLoggedIn(true);
        } catch (err) {
            console.error("error signing in", err);
            toast.error("Error logging in. " + (err as Error).message);
        } finally {
            localStorage.removeItem("login-in-progress");
            setLoginInProgress(false);
        }
    }, [magic?.oauth2]);

    useEffect(() => {
        if (!magic) return;
        finalizeLogin();
    }, [finalizeLogin, magic]);

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
            const magic = new MagicBase(
                process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
                {
                    network: {
                        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
                        chainId: parseInt(
                            process.env.NEXT_PUBLIC_CHAIN_ID as string
                        ),
                    },
                    extensions: [new OAuthExtension()],
                }
            );

            setMagic(magic);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await magic?.user.logout();
            setUser(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error("error logging out", error);
        }
    }, [magic]);

    const value = useMemo(() => {
        return {
            magic,
            isLoginInProgress,
            isLoggedIn,
            user,
            login: initiateLogin,
            logout,
        };
    }, [magic, isLoggedIn, user, initiateLogin, isLoginInProgress, logout]);

    return (
        <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
    );
};

export default MagicProvider;
