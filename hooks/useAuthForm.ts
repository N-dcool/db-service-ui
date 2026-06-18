'use client';

import { saveTokens } from "@/lib/tokens";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthApiFn = (email: string, password: string, displayName?: string) => Promise<{ accessToken: string, refreshToken: string }>;

interface UseAuthFormOptions {
    apiFn: AuthApiFn;
    fallbackError?: string;
    validate?: (email: string, password: string) => string | null;
    hasDisplayName?: boolean
}

export function useAuthForm({ apiFn, fallbackError = 'Failed', validate, hasDisplayName = false }: UseAuthFormOptions) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError("");

        if(validate) {
            const validationError = validate(email, password);
            if(validationError) {
                setError(validationError);
                return;
            }
        }

        setLoading(true);
        try{
            const { accessToken, refreshToken } = await apiFn(email, password, hasDisplayName ? displayName : undefined);
            saveTokens(accessToken, refreshToken);
            router.push("/dashboard");
        } catch(err: unknown) {
            const msg = err instanceof Error ? err.message : fallbackError;
            setError(msg === 'MAINTENANCE' ?
                'Server is under maintenance. Try again shortly.' 
                : msg
            );
        } finally {
            setLoading(false);
        }
    };

    return {email, setEmail, password, setPassword, displayName, setDisplayName, error, setError, loading, handleSubmit };

}