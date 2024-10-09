import React, { useState } from "react";
import { ExternalLink } from 'lucide-react';

const ExerciseList = ({ exercises }) => {
  const [filter, setFilter] = useState('');

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(filter.toLowerCase()) ||
    exercise.muscle_group.toLowerCase().includes(filter.toLowerCase()) ||
    exercise.exercise_type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Exercise List</h1>
      <input
        type="text"
        placeholder="Filter exercises..."
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-600">{exercise.name}</h2>
              {/* <p className="text-gray-600 mb-2">{exercise.description}</p> */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600">{exercise.muscle_group}</span>
                <span className="text-sm font-medium text-green-600">{exercise.exercise_type}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">Equipment: {exercise.equipment}</p>
              {exercise.url && (
                <a
                  href={exercise.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:underline"
                >
                  View
                  <ExternalLink size={16} className="ml-1" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;