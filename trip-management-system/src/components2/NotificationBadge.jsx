import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';

const NotificationBadge = ({ count, notifications = [] }) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <motion.div className="relative">
      <button onClick={togglePopup} className="relative focus:outline-none">
        <FaBell className="text-white text-xl drop-shadow-md" />
        {count > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {count}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 mt-2 w-64 bg-[#1f1f1f] text-white rounded-xl shadow-2xl border border-gray-700 z-50 p-4 backdrop-blur-md"
          >
            <h3 className="text-md font-semibold mb-2 text-gray-300">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No notifications 📭</p>
            ) : (
              <ul className="space-y-2">
                {notifications.slice(0, 3).map((note, index) => (
                  <li
                    key={index}
                    className="text-sm bg-[#2a2a2a] rounded-lg p-2 border border-gray-600 shadow-md hover:bg-[#333] transition"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotificationBadge;
