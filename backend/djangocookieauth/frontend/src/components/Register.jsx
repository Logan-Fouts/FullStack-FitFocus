import React, { useState } from "react"
import Cookies from 'universal-cookie'
import { Leaf } from 'lucide-react';

const cookies = new Cookies();

export const Register = ({ isAuthenticated, setIsAuthenticated, onRegisterSuccess }) => {
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
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 justify-center items-center">
            <div className='flex'>
                <Leaf size={40} className='text-gray-800 mr-2' />
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Fit Focus</h1>
            </div>
            <form onSubmit={regUser} className="shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4 w-10/12">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-8">Register</h1>
                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="username">Username:</label>
                <input className="mb-2 text-black" type="text" id="username" onChange={(event) => setUsername(event.target.value)} />
                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="email">Email:</label>
                <input className="mb-2 text-black" type="text" id="email" onChange={(event) => setEmail(event.target.value)} />
                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="password">Password:</label>
                <input className="mb-2 text-black" type="password" id="password" onChange={(event) => setPassword(event.target.value)} />
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 mt-2" type="submit">Register</button>
            </form>
            <a href="/">Login</a>
        </div>
    )
}