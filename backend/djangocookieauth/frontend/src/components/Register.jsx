import React, { useState } from "react"

export const Register = ({ cookies, isAuthenticated, setIsAuthenticated, onRegisterSuccess }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const isResponseOk = (response) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    }


    const regUser = (event) => {
        event.preventDefault();
        console.log("Registering User: " + username);
        fetch("/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.get("csrftoken")
            },
            credentials: "same-origin",
            body: JSON.stringify(
                {
                    username: username,
                    email: email,
                    password: password
                }
            )
        })
            .then(isResponseOk)
            .then((data) => {
                console.log(data);
                setIsAuthenticated(true);
                onRegisterSuccess();
                setUsername("");
                setEmail("");
                setPassword("");
                window.location.href = '/';
            })
            .catch((error) => {
                console.log(error);
            })
    }

    if (isAuthenticated) {
        return <div>You are already registered and logged in!</div>
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={regUser}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" onChange={(event) => setUsername(event.target.value)} />

                <label htmlFor="email">Email:</label>
                <input type="text" id="email" onChange={(event) => setEmail(event.target.value)} />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" onChange={(event) => setPassword(event.target.value)} />

                <button type="submit">Register</button>
            </form>
        </div>
    )
}