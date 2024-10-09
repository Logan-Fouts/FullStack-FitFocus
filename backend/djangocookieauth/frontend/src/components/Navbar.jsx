import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, CalendarDays, Leaf } from 'lucide-react';


export const Navbar = () => {

    return (
        <nav className="bg-gray-800 p-2 sticky top-0">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <Leaf size={40} className='text-white'/>
                </Link>
                <h3 className='text-3xl font-semi-bold text-white ml-8'>FitFocus</h3>

                <div className='flex'>
                    <Link to="/add-exercise">
                            <Dumbbell size={25} className='text-white mr-8' />
                    </Link>
                    <Link to="/add-routine">
                            <CalendarDays size={25} className='text-white' />
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;