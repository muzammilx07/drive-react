import React from 'react';
import Navbar from './Navbar';
import { useAuth } from './contexts/AuthProvider';
import Sidebar from './Sidebar'
import Module from './Module'

const DashBoard = () => {
  const { isMenuOpen, toggleMenu } = useAuth();

  const handleDashboardClick = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  return (
    <div onClick={handleDashboardClick} className='flex flex-col h-screen'>
      <Navbar />
      <div className= 'w-screen flex flex-grow flex-row'>
        <Sidebar/>
        <Module/>
        </div>
    </div>
  );
};

export default DashBoard;
