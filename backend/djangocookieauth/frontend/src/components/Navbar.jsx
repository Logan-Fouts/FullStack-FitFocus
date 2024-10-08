import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export const Navbar = () => {

    return (
        <nav className="bg-gray-800 p-2">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src="logos/logo-white.png" alt="Logo" className="h-8 mr-2" />
                </Link>
                <h3 className='text-3xl font-semi-bold text-white'>FitFocus</h3>

                <Link to="/add-exercise">
                        <Dumbbell size={25} className='text-white' />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;