// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Player from './Player';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';


const MainLayout = ({children}) => {

  const { currentUser } = useAuth();
  console.log("MainLayout - Current User:", currentUser);

 // rest of component

  const { currentTrack } = usePlayer();
  
  return (
    <div className="flex flex-col h-screen bg-spotify-black text-spotify-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar />
          
          <motion.main 
            className="flex-1 overflow-y-auto p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`pb-${currentTrack ? '20' : '4'}`}>
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
      
      {/* Player */}
      <Player />
    </div>
  );
};

export default MainLayout;