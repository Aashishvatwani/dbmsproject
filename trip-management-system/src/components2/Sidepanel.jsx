import React, { useState } from 'react';
import { FaUser, FaUsers, FaComments, FaTachometerAlt, FaBars, FaMoneyBill, FaPage4, FaPagelines } from 'react-icons/fa';
import { motion } from 'framer-motion';
import NotificationBadge from './NotificationBadge';
import { useNavigate } from 'react-router-dom';
const SidePanel = ({ onNavigate, newChatCount = 0, newBudgetCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

  return (
    <>
      {/* Notification Bell at Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <NotificationBadge count={newChatCount + newBudgetCount} />
      </div>

      {/* Side Panel Toggle Button at Top Right */}
      <button
        onClick={togglePanel}
        className="p-3 fixed top-4 right-4 z-50 bg-[#1f1f1f] text-white rounded-full shadow-lg"
      >
        <FaBars />
      </button>

      {/* Side Panel */}
      {isOpen && (
        <motion.div
          className="fixed top-0 right-0 h-full w-64 bg-[#121212] text-white shadow-2xl p-6 space-y-6 z-40"
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
            <button 
            onClick={() => navigate('/user-profile-page')}
            >
          <div className="flex items-center space-x-3 text-xl font-semibold">
            <FaUser className="text-blue-400" />
            <span>User Profile</span>
          </div>
          </button>
          <button
            onClick={() => navigate('/trip-dashboard')}
            className="flex items-center space-x-3 hover:text-blue-400"
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate('teammates')}
            className="flex items-center space-x-3 hover:text-green-400"
          >
            <FaUsers />
            <span>Teammates</span>
          </button>
          <button
            onClick={() => navigate('/expense-upload')}
            className="flex items-center space-x-3 hover:text-green-800"
          >
            <FaMoneyBill />
            <span>Expanses</span>
          </button>
          <button
            onClick={() => navigate('/doument-upload')}
            className="flex items-center space-x-3 hover:text-blue-800"
          >
            <FaPage4 />
            <span>Document Upload</span>
          </button>
          <button
            onClick={() => navigate('/Documentview')}
            className="flex items-center space-x-3 hover:text-orange-400"
          >
            <FaPagelines />
            <span>Document view</span>
          </button>
          <button
            onClick={() => navigate('/chatroom')}
            className="flex items-center space-x-3 hover:text-yellow-400 relative"
          >
            <FaComments />
            <span>Chatroom</span>
            {newChatCount > 0 && (
              <motion.div
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {newChatCount}
              </motion.div>
            )}
          </button>
        </motion.div>
      )}
    </>
  );
};

export default SidePanel;
