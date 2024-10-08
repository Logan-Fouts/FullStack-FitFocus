import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie'

const cookies = new Cookies();

export const CalorieTracker = () => {
    const [calories, setCalories] = useState('');
    const [totalcals, setTotalcals] = useState('');

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await fetch('/api/get-calorie-entries/');
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setTotalcals(data[0].calories);
                } else {
                    setTotalcals(0)
                }
            } else {
                console.error('Failed to fetch calorie entries');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const currentDate = new Date().toISOString().split('T')[0];

        try {
            const response = await fetch('/api/add-calorie-entry/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookies.get("csrftoken"),
                },
                credentials: "same-origin",
                body: JSON.stringify({ date: currentDate, calories: parseInt(calories) }),
            });
            if (response.status >= 200 && response.status < 299) {
                const data = await response.json();
                fetchEntries();
                setCalories('');
            } else {
                console.error('Failed to add calorie entry');
                alert("Unable to add calorie entry");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Unable to add calorie entry");
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Calories Today</h3>
                <span className="text-2xl font-bold text-indigo-600">{totalcals ? <span>{totalcals}</span> : <span>2900</span>}</span>
            </div>
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                    type="number"
                    id="calories"
                    value={calories}
                    onChange={(event) => setCalories(event.target.value)}
                    placeholder="Enter calories"
                    className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                    Add
                </button>
            </form>
        </div>
    );
};

export default CalorieTracker;