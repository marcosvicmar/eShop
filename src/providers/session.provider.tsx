import { Users } from "@/models";
import { useRouter } from "next/router";
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface SessionProps {
    children?: ReactNode
}

interface SessionSchema {
    token: string,
    loading: boolean,
    isLogged: boolean,
    currentUser?: Users,
    login: (email: string, password: string) => Promise<void>,
    logout: () => void
}

const SessionContext = createContext<SessionSchema>({
    token: "",
    loading: false,
    isLogged: false,
    currentUser: undefined,
    login: (email: string, password: string) => Promise.resolve(),
    logout: () => ({})
});

export default function SessionProvider({ children }: SessionProps) {
    const { push } = useRouter();
    const [ token, setToken ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const [ isLogged, setIsLogged ] = useState(false);
    const [ currentUser, setCurrentUser ] = useState(undefined);
    
    const login = useCallback(async (email: string, password: string) => {
        const token = btoa(`${email}:${password}`);

        setLoading(true);

        const validation = await fetch("/api/v1/auth/me", {
            headers: { 'Authorization': `Basic ${token}` },
            cache: "no-cache"
        });

        if (validation.ok) {
            localStorage.setItem("token", token);

            setToken(token);
            setIsLogged(!!token);
            setCurrentUser(await validation.json())
        }

        setLoading(false);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');

        setIsLogged(false);
        setCurrentUser(undefined);
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        fetch("/api/v1/auth/me", {
            headers: { 'Authorization': `Basic ${storedToken}` },
            cache: "no-cache"
        }).then(data => data.json()).then(data => {
            if (data.type !== "error") {
                setToken(storedToken || "");
                setIsLogged(!!storedToken);
                setLoading(false);
                setCurrentUser(data);
            } else {
                push('/login');
            }
        });
    }, [login, logout, isLogged, loading]);

    const value = useMemo<SessionSchema>(() => {
        return {
            token,
            loading,
            isLogged,
            currentUser,
            login,
            logout
        }
    }, [
        token, 
        loading, 
        isLogged, 
        currentUser, 
        login, 
        logout
    ]);

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}

export function useSession() {
    const context = useContext(SessionContext);

    if (!context) throw new Error("useSession must be used within SessionProvider");

    return context;
}