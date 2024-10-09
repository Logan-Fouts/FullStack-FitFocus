import React, { useState } from "react";
import { Calendar, Activity } from 'lucide-react';

const RoutineList = ({ routines }) => {
    const [filter, setFilter] = useState('');

    const filteredRoutines = routines.filter(routine =>
        routine.name.toLowerCase().includes(filter.toLowerCase()) ||
        routine.description.toLowerCase().includes(filter.toLowerCase()) ||
        routine.days.some(day => day.toLowerCase().includes(filter.toLowerCase()))
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Routines</h1>
            <input
                type="text"
                placeholder="Filter routines..."
                className="w-full p-2 mb-4 border rounded"
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRoutines.map(routine => (
                    <div key={routine.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 text-gray-600">{routine.name}</h2>
                            <p className="text-gray-600 mb-2 font-thin">{routine.description}</p>
                            <div className="flex items-center">
                                <Calendar size={16} className="mr-2 text-blue-500" />
                                <span className="text-sm font-medium text-blue-600">
                                    {routine.days.join(', ')}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-600">Exercises</h3>
                                <ul className="list-inside">
                                    {routine.exercises.map(exercise => (
                                        <li key={exercise.id} className="flex items-center space-x-2 text-gray-600">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <Activity className="text-green-600" size={20} />
                                            <span>{exercise.name}</span>
                                        </li>

                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoutineList;