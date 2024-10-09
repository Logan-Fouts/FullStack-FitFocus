import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import ExerciseList from './ExerciseList';
import { Navbar } from "./Navbar";

const cookies = new Cookies();

const AddExercise = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    public: false,
    description: '',
    url: '',
    muscle_group: '',
    exercise_type: '',
    equipment: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/add-exercise/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': cookies.get('csrftoken')
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add exercise');
      }

      const newExercise = await response.json();
      setExercises(prevExercises => [...prevExercises, newExercise]);
      setFormData({
        name: '',
        public: false,
        description: '',
        url: '',
        muscle_group: '',
        exercise_type: '',
        equipment: ''
      });
      console.log('Exercise added:', newExercise);
    } catch (error) {
      console.error('Error adding exercise:', error);
      setError('Failed to add exercise. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <Navbar />
      <div className='m-8 p-4 rounded shadow-2xl'>
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Add New Exercise</h2>
        {error && <p className="text-red-500 mb-5">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label htmlFor="name" className="text-black block text-sm font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-white text-gray-800 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-black">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="bg-white text-gray-800 mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-black">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="muscle_group" className="block text-sm font-medium text-black">Muscle Group</label>
            <input
              type="text"
              id="muscle_group"
              name="muscle_group"
              value={formData.muscle_group}
              onChange={handleChange}
              required
              className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="exercise_type" className="block text-sm font-medium text-black">Exercise Type</label>
            <select
              id="exercise_type"
              name="exercise_type"
              value={formData.exercise_type}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-1"
            >
              <option value="">Select Type</option>
              <option value="1">Strength</option>
              <option value="2">Cardio</option>
              <option value="3">Flexibility</option>
              <option value="4">Balance</option>
            </select>
          </div>
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium text-black">Equipment</label>
            <input
              type="text"
              id="equipment"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="public"
                checked={formData.public}
                onChange={handleChange}
                className="w-8 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="text-sm text-black">Make this exercise public</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Exercise'}
          </button>
        </form>
      </div>

      <div className="mt-10">
        {isLoading ? (
          <p>Loading exercises...</p>
        ) : (
          <ExerciseList exercises={exercises} />
        )}
      </div>
    </div>
  );
};

export default AddExercise;