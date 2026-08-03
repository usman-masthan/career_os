"use client";
import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className='fixed top-0 right-0 p-4 z-[100]'>
            <button
                onClick={toggleTheme}
                className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                aria-label='Toggle dark mode'
            >
                {isDarkMode ? (
                    <FiSun size={22} className='text-yellow-300' />
                ) : (
                    <FiMoon size={22} className='text-gray-600' />
                )}
            </button>
        </div>
    );
};

export default Navbar;
