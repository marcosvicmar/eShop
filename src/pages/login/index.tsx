import React, { FormEvent, FormEventHandler, useState } from "react";
import loginCss from './login.module.css';
import { useRouter } from "next/router";
import { useSession } from "@/providers/session.provider";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Link from 'next/link';


export default function Login(props: any) {
    const router = useRouter();
    const { login } = useSession();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!email || !pass) {
            setError('Please fill in both fields');
            return;
        }
        try {
            await login(email, pass);
            router.push('/');
        } catch (err) {
            setError(null);
        }
    }

    return (
        <div className={loginCss["login-body"]}>
            <div className={loginCss["auth-form-container"]}>
                <h1 className={loginCss.title}>Shop Commerce</h1>
                <h2 className={loginCss.subtitle}>Login</h2>
                {error && <p>{error}</p>}
                <form className={loginCss["login-form"]} onSubmit={handleSubmit}>
                    <FormControl>
                        <FormLabel htmlFor="email">email</FormLabel>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                        <FormLabel htmlFor="password">password</FormLabel>
                        <Input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                        <Button type="submit">Log In</Button>
                        <Button as={Link} href="/register">
                            Register
                        </Button>
                    </FormControl>
                </form>
            </div>
        </div>
    );
}