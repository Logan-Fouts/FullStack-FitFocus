import React, { useEffect, useState } from "react"
import { CalorieTracker } from "./CalsCounter"
import { Navbar } from "./Navbar";
import RoutineList from "./RoutineList";

export const Home = () => {
    const [username, setUsername] = useState("");
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        whoami();
        getRoutines();
    }, []);

    const getRoutines = async () => {
        try {
            const response = await fetch('/api/get-routines/');
            if (!response.ok) {
                throw new Error('Failed to fetch exercises');
            }
            const data = await response.json();
            setRoutines(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            setError('Failed to fetch exercises. Please try again.');
        }
    };

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

    return (
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            <div className="flex-grow flex flex-col p-4 md:p-8 space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>
                    <h2 className="text-2xl font-semibold text-indigo-600">
                        {username ? username : 'Anonymous'}
                    </h2>
                </div>
                <CalorieTracker className="bg-white rounded-lg shadow-lg p-6 md:p-8" />
                <RoutineList routines={routines} workoutMode={true} />
            </div>
        </div>
    )
}