import React, { useState ,useEffect} from 'react';
import { FaRegClipboard, FaMoneyBillWave, FaRobot, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import Framer Motion
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  } from 'recharts';
  import SidePanel from './Sidepanel';
import NotificationBadge from './NotificationBadge';
import CityQuestionPopup from './Aichatpod'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for API calls
const TripDashboard = () => {
  const [members, setMembers] = useState('');
  const [idealBudget, setIdealBudget] = useState('');
  const [city1, setCity1] = useState('');
  const [city, setCity] = useState('');
  const [userType, setUserType] = useState('Student');
  const [aiBudget, setAiBudget] = useState(null);
  const [showChart, setShowChart] = useState(false);

const navigate = useNavigate();
useEffect(() => {
  const fetchCity = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/finals");
      setCity1(res.data[0]?.package_city || "your city");
    } catch (err) {
      console.error("Error fetching city:", err);
    }
  };
  fetchCity();
}, []);
  // Mock city list for testing
  const cityList = ['Jaipur', 'Udaipur', 'Mount Abu', 'Ajmer', 'Pushkar',city1];


  const handleSubmitai = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/aibudget", {
        city,
        profession: userType,
        members,
        idealbudget: idealBudget,
      });

      const { minimum, ideal, maximum } = response.data;

      if (minimum !== null && ideal !== null && maximum !== null) {
        setAiBudget({
          minBudget: minimum,
          idealBudget: ideal,
          maxBudget: maximum,
        });
      } else {
        alert("AI could not fetch the budget correctly. Please try again.");
        console.log("AI response was:", response.data);
      }
    } catch (error) {
      console.error("Error fetching AI budget:", error);
      alert("Failed to get AI budget. Please ensure the server is running and try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/team-registration/${members}`); // Navigate to the team registration page
  };

  const spendingData = [
    { name: 'Aryan', value: 2500 },
    { name: 'Sakshi', value: 400 },
    { name: 'Ravi', value: 1100 },
    { name: 'Neha', value: 300 },
    { name: 'Karan', value: 100 },
  ];
  
  const COLORS = ['#00BFFF', '#FF69B4', '#32CD32', '#FFD700', '#FF4500'];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6 text-white font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }} // Fade-in effect for the page
    >
      <motion.div
        className="bg-[#121212] shadow-2xl rounded-3xl p-10 max-w-4xl w-full text-center border border-gray-800"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Plan Smarter. <br className="hidden md:block" /> Travel Better.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1 }}
        >
          TripBuddy helps you manage group trips with ease – register your journey, split costs, get AI advice, and store documents securely.
        </motion.p>

        {/* Feature Highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <FeatureItem icon={<FaRegClipboard className="text-blue-400 text-2xl" />} label="Register & Plan Trips" />
          <FeatureItem icon={<FaMoneyBillWave className="text-green-400 text-2xl" />} label="Track & Split Expenses" />
          <FeatureItem icon={<FaRobot className="text-yellow-400 text-2xl" />} label="AI Budget Suggestions" />
          <FeatureItem icon={<FaLock className="text-purple-400 text-2xl" />} label="Secure Blockchain Storage" />
        </motion.div>

        {/* Trip Registration Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h3
            className="text-2xl font-semibold mb-4"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
          >
            🎯 Trip Registration
          </motion.h3>

          <div>
            <label className="block mb-2 text-gray-300">Number of Members</label>
            <motion.input
              type="number"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              min="1" 
              className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
              required
              whileFocus={{ scale: 1.05 }}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">Your Ideal Budget (₹)</label>
            <motion.input
              type="number"
              value={idealBudget}
              onChange={(e) => setIdealBudget(e.target.value)}
              min="100"
              className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
              required
              whileFocus={{ scale: 1.05 }}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">City</label>
            <motion.select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
              required
            >
              <option value="">Select a City</option>
              {cityList.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </motion.select>
          </div>

          <div>
            <label className="block mb-2 text-gray-300">You are a...</label>
            <motion.select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
            >
              <option value="Student">Student</option>
              <option value="Working Professional">Working Professional</option>
              <option value="Traveller">Traveller</option>
            </motion.select>
          </div>

          <motion.button
            type="submit"
            onClick={handleSubmitai}
            className="w-full mt-4 bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition"
            whileHover={{ scale: 1.05 }}
          >
            Get AI Budget Suggestion
          </motion.button>
          
        </motion.form>

        {/* AI BUDGET RESULT */}
        {aiBudget && (
          <motion.div
            className="mt-10 p-6 rounded-xl bg-[#222] border border-gray-600 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4">💡 AI Budget Recommendation</h3>
            <p>
              <span className="text-gray-400">Minimum Budget:</span> ₹{aiBudget.minBudget}
            </p>
            <p>
              <span className="text-gray-400">Ideal Budget:</span> ₹{aiBudget.idealBudget}
            </p>
            <p>
              <span className="text-gray-400">Maximum Budget:</span> ₹{aiBudget.maxBudget}
            </p>
          </motion.div>

        )}
        <motion.button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-4 bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition"
            whileHover={{ scale: 1.05 }}
          >
            go to team registration page 
          </motion.button>
      </motion.div>
      <SidePanel />
   <CityQuestionPopup /> {/* Include the CityQuestionPopup component here */}
    </motion.div>
  );
};

const FeatureItem = ({ icon, label }) => {
  return (
    <motion.div
      className="flex items-center space-x-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>{icon}</div>
      <p className="text-gray-300 font-medium">{label}</p>
   
    </motion.div>
   
  );
};

export default TripDashboard;
