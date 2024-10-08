import React, { useEffect, useState } from "react"
import { CalorieTracker } from "./CalsCounter"
import { Navbar } from "./Navbar";

export const Home = () => {
    const [username, setUsername] = useState("");

    const whoami = () => {
        fetch("/api/whoami/", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("You are logged in as: " + data.username);
                setUsername(data.username);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        whoami();
    }, [])

    return (
        <div className="flex flex-col w-full min-h-screen">
            <Navbar />
            <div className="flex-grow flex flex-col p-4 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h1>
                    <h2 className="text-xl text-indigo-600">
                        {username ? username : 'Anonymous'}
                    </h2>
                </div>
                <CalorieTracker />
            </div>
        </div>
    )
}