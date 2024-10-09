import React, { useState } from "react";
import { Calendar, Activity, X } from 'lucide-react';

const ExerciseModal = ({ isOpen, onClose, exercise }) => {
    if (!isOpen || !exercise) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-700">{exercise.name}</h3>
                    <button onClick={onClose} className="text-gray-800 hover:text-gray-500 p-2 m-2">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-gray-600">{exercise.description || "No description available."}</p>
            </div>
        </div>
    );
};

const RoutineList = ({ routines, workoutMode = false }) => {
    const [filter, setFilter] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);

    const filteredRoutines = routines.filter(routine =>
        routine.name.toLowerCase().includes(filter.toLowerCase()) ||
        routine.description.toLowerCase().includes(filter.toLowerCase()) ||
        routine.days.some(day => day.toLowerCase().includes(filter.toLowerCase()))
    );

    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
    };

    const closeModal = () => {
        setSelectedExercise(null);
    };

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
                                        <li
                                            key={exercise.id}
                                            className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded"
                                            onClick={() => handleExerciseClick(exercise)}
                                        >
                                            {workoutMode && (
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            )}
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
            <ExerciseModal
                isOpen={!!selectedExercise}
                onClose={closeModal}
                exercise={selectedExercise}
            />
        </div>
    );
};

export default RoutineList;