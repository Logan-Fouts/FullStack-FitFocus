import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Navbar } from "./Navbar";
import RoutineList from './RoutineList';

const cookies = new Cookies();

const AddRoutine = () => {
    const [routines, setRoutines] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        days: [],
        exercises: []
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getRoutines();
        getExercises();
    }, []);

    const getExercises = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/get-exercises/');
            if (!response.ok) {
                throw new Error('Failed to fetch exercises');
            }
            const data = await response.json();
            setExercises(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            setError('Failed to fetch exercises. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getRoutines = async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleDayChange = (e) => {
        const { checked, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            days: checked
                ? [...prevState.days, value]
                : prevState.days.filter(day => day !== value)
        }));
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (name === 'exercises') {
            const selectedExercises = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prevState => ({
                ...prevState,
                exercises: selectedExercises
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(JSON.stringify(formData));
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/add-routine/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookies.get('csrftoken')
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to add routine');
            }

            setFormData({
                name: '',
                description: '',
                days: [],
                exercises: []
            });
            console.log('Routine added');
            getRoutines();
        } catch (error) {
            console.error('Error adding routine:', error);
            setError('Failed to add routine. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            <div className='m-8 bg-slate-100 p-2 rounded shadow-2xl'>
                <h2 className="text-2xl font-bold mb-5 text-gray-800">Add New Routine</h2>
                {error && <p className="text-red-500 mb-5">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className='text-black'>Name:</label>
                        <input
                            type="text"
                            className="text w-full p-2 border rounded"
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className='text-black'>Description:</label>
                        <input
                            type="text"
                            className="text w-full p-2 border rounded"
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Days</label>
                        <div className="space-y-2">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                <label key={day} className="inline-flex items-center mr-4">
                                    <input
                                        type="checkbox"
                                        name="days"
                                        value={day}
                                        checked={formData.days.includes(day)}
                                        onChange={handleDayChange}
                                        className="form-checkbox h-5 w-5 text-indigo-600"
                                    />
                                    <span className="ml-2 text-black">{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="exercises" className="block text-sm font-medium text-gray-700">Select Exercises</label>
                        <select
                            id="exercises"
                            name="exercises"
                            multiple
                            value={formData.exercises}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-white focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {exercises.map(exercise => (
                                <option key={exercise.id} value={exercise.id} className='text-black'>
                                    {exercise.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Adding...' : 'Add Routine'}
                    </button>
                </form>
            </div>
            <RoutineList routines={routines} />
        </div>
    );
};

export default AddRoutine;