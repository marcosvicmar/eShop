import React, { useState } from "react";
import loginCss from '../login/login.module.css';
import { useRouter } from "next/router";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

export default function Register(props: any) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [address, setAddress] = useState('');
    const [credcard, setCreditcard] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <div className={loginCss["login-body"]}>
            <div className={loginCss["auth-form-container"]}>
                <h1 className={loginCss.title}>Shop Commerce</h1>
                <h2 className={loginCss.subtitle}>Register</h2>
                <form className={loginCss["login-form"]} onSubmit={handleSubmit}>
                    <FormControl>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input value={name} onChange={(e) => setName(e.target.value)} id="name" name="name" />
                        <FormLabel htmlFor="surname">Surname</FormLabel>
                        <Input value={surname} onChange={(e) => setSurname(e.target.value)} id="surname" name="surname" />
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                        <FormLabel htmlFor="address">Address</FormLabel>
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} id="address" name="address" />
                        <FormLabel htmlFor="credcard">Creditcard</FormLabel>
                        <Input value={credcard} onChange={(e) => setCreditcard(e.target.value)} id="creditcard" name="credcard" />
                        <Button type="submit">Register</Button>
                        <Button type="button" onClick={() => router.push('/login')}>Log In</Button>
                    </FormControl>
                </form>
                <Button className={loginCss["link-btn"]} onClick={() => router.push("/login")}>Already have an account? Login here.</Button>
            </div>
        </div>
    );
}