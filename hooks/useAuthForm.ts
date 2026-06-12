'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthApiFn = (email: string, password: string) => Promise<{ token: string }>;

interface UseAuthFormOptions {
    apiFn: AuthApiFn;
    fallbackError?: string;
    validate?: (email: string, password: string) => string | null;
}

export function useAuthForm({ apiFn, fallbackError = 'Failed', validate }: UseAuthFormOptions) {
    const router = useRouter();
    const [email, setEmail] = useState("");
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
            const { token } = await apiFn(email, password);
            localStorage.setItem("token", token);
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

    return {email, setEmail, password, setPassword, error, setError, loading, handleSubmit };

}