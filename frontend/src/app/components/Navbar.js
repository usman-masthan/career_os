"use client";
import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check initial theme preference
        if (localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

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