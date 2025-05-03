import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FaBus, FaTrain, FaPlane } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import './TraditionalCalendar.css';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import FirebaseConfig from './FirebaseConfig';

const BookingPage = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [media, setMedia] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [userId, setUserId] = useState(null);
  const [locationAvailable, setLocationAvailable] = useState(false);
  const navigate = useNavigate();

  const firebaseApp = initializeApp(FirebaseConfig);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is logged in:', user.email);
        setUserId(user.uid);
      } else {
        console.log('No user is logged in');
      }
    });

    getCurrentLocation();
    return () => unsubscribe();
  }, []);

  const handleDateChange = (date, type) => {
    if (type === 'from') {
      setFromDate(date);
    } else if (type === 'to') {
      setToDate(date);
    }
  };

  const handleMediaChange = (event) => {
    setMedia(event.target.value);
  };

  const handleCityChange = (event) => {
    setFromCity(event.target.value);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((response) => response.json())
            .then((data) => {
              setFromCity(data.city || 'Unknown');
              setLocationAvailable(true);
            })
            .catch(() => {
              alert('Unable to fetch location');
              setLocationAvailable(false);
            });
        },
        () => {
          alert('Unable to retrieve location.');
          setLocationAvailable(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleFinalchange = () => {
    if (!userId) {
      alert('Please login to continue.');
      return;
    }

    axios
      .post('http://localhost:5000/api/bookings', {
        fromdate: fromDate,
        todate: toDate,
        mediam: media,
        fromcity: fromCity,
        user_id: userId,
      })
      .then((response) => {
        alert('Booking recorded successfully!');
        console.log('Data saved successfully:', response.data);
        navigate(`/card`);
      })
      .catch((error) => {
        alert('Sorry, an error occurred.');
        console.error('Error saving booking data:', error);
      });
  };


  // Motion animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut', when: 'beforeChildren', staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-gray-100 font-sans antialiased">
      <motion.div
        className="max-w-3xl mx-auto p-8 rounded-xl shadow-2xl bg-black bg-opacity-70 backdrop-filter backdrop-blur-md border border-yellow-600"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">Plan Your Royal Journey</h1>

        {/* Calendar for selecting fromdate and todate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div variants={cardVariants}>
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">Departure Date:</h3>
            <div className="rounded-md overflow-hidden shadow-sm border border-yellow-800 bg-gray-800">
              <Calendar
                onChange={(date) => handleDateChange(date, 'from')}
                value={fromDate}
                className="w-full"
                classNames={{
                  wrapper: '', // Remove default wrapper styling
                  navigation: 'flex justify-between p-3 bg-gray-900 border-b border-yellow-700',
                  navigation__arrow: 'bg-transparent border-none text-yellow-500 text-xl cursor-pointer transition-colors hover:text-yellow-300 focus:outline-none',
                  navigation__label: 'text-red-500 font-semibold text-lg',
                  monthView__weekdays: 'text-red-500 font-bold text-sm border-b border-yellow-700 bg-gray-800',
                  monthView__weekdays__weekday: 'text-center py-2',
                  monthView__days: 'grid grid-cols-7 gap-1 p-2',
                  monthView__days__day: 'text-gray-300 text-center py-2 rounded-md transition-colors hover:bg-gray-700 focus:outline-none focus:bg-gray-700',
                  monthView__days__day__neighboringMonth: 'text-gray-600',
                  monthView__days__day__weekend: 'text-orange-400',
                  monthView__days__day__active: 'bg-yellow-500 text-black rounded-md font-semibold',
                  tile: 'focus:outline-none',
                }}
              />
            </div>
          </motion.div>
          <motion.div variants={cardVariants}>
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">Return Date:</h3>
            <div className="rounded-md overflow-hidden shadow-sm border border-yellow-800 bg-gray-800">
              <Calendar
                onChange={(date) => handleDateChange(date, 'to')}
                value={toDate}
                className="w-full"
                classNames={{
                  wrapper: '', // Remove default wrapper styling
                  navigation: 'flex justify-between p-3 bg-gray-900 border-b border-yellow-700',
                  navigation__arrow: 'bg-transparent border-none text-yellow-500 text-xl cursor-pointer transition-colors hover:text-yellow-300 focus:outline-none',
                  navigation__label: 'text-red-500 font-semibold text-lg',
                  monthView__weekdays: 'text-red-500 font-bold text-sm border-b border-yellow-700 bg-gray-800',
                  monthView__weekdays__weekday: 'text-center py-2',
                  monthView__days: 'grid grid-cols-7 gap-1 p-2',
                  monthView__days__day: 'text-gray-300 text-center py-2 rounded-md transition-colors hover:bg-gray-700 focus:outline-none focus:bg-gray-700',
                  monthView__days__day__neighboringMonth: 'text-gray-600',
                  monthView__days__day__weekend: 'text-orange-400',
                  monthView__days__day__active: 'bg-yellow-500 text-black rounded-md font-semibold',
                  tile: 'focus:outline-none',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Media Selection */}
        <motion.div className="mb-6" variants={cardVariants}>
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">Travel Mode:</h3>
          <div className="relative rounded-md shadow-sm">
            <select
              className="w-full p-3 border border-yellow-700 rounded-md bg-gray-800 text-yellow-300 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={media}
              onChange={handleMediaChange}
            >
              <option value="">-- Choose --</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="plane">Plane</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </motion.div>

        {/* City Search Bar */}
        <motion.div className="mb-6" variants={cardVariants}>
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">Departure City:</h3>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              className="w-full p-3 border border-yellow-700 rounded-md bg-gray-800 text-yellow-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={fromCity}
              onChange={handleCityChange}
              placeholder="Enter departure city"
            />
          </div>
          <button
            className="w-full mt-3 py-2 px-4 bg-yellow-500 text-black rounded-md shadow-sm hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 transition duration-300"
            onClick={getCurrentLocation}
          >
            <svg className="inline-block mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l14 3l-2 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Get Current Location
          </button>
        </motion.div>

        {/* Cards to display media options */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {media && (
            <motion.div className="p-4 border border-yellow-700 rounded-md shadow-sm bg-gray-800 text-center hover:scale-105 transition-all duration-300" variants={cardVariants}>
              <h4 className="text-lg font-semibold text-yellow-400 mb-2">{media === 'bus' ? 'Bus' : media === 'train' ? 'Train' : 'Plane'}</h4>
              <div className="flex justify-center items-center mb-3 text-4xl">
                {media === 'bus' && <FaBus className="text-blue-400" />}
                {media === 'train' && <FaTrain className="text-green-400" />}
                {media === 'plane' && <FaPlane className="text-yellow-400" />}
              </div>
              <p className="text-2xl text-yellow-300">{media === 'bus' ? '' : media === 'train' ? '' : ''}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Display selected data */}
        <div className="mt-6 p-4 rounded-md bg-gray-900 border border-yellow-700">
          <h2 className="text-xl font-semibold text-yellow-500 mb-3">Your Selection</h2>
          <p className="text-gray-300 mb-1">
            <strong className="text-yellow-400">Departure Date:</strong> {fromDate ? fromDate.toLocaleDateString() : <span className="text-red-500">Not selected</span>}
          </p>
          <p className="text-gray-300 mb-1">
            <strong className="text-yellow-400">Return Date:</strong> {toDate ? toDate.toLocaleDateString() : <span className="text-red-500">Not selected</span>}
          </p>
          <p className="text-gray-300 mb-1">
            <strong className="text-yellow-400">Departure City:</strong> {fromCity || <span className="text-red-500">Not selected</span>}
          </p>
          <p className="text-gray-300">
            <strong className="text-yellow-400">Travel Mode:</strong> {media ? media.charAt(0).toUpperCase() + media.slice(1) : <span className="text-red-500">Not selected</span>}
          </p>
          <motion.div className="mt-6 text-center" variants={cardVariants}>
  <button
    className="py-3 px-6 bg-yellow-500 text-black font-semibold rounded-md shadow-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 transition duration-300"
    onClick={handleFinalchange}
  >
    Go to Final Page
  </button>
</motion.div>
        </div>
      </motion.div>
    </div>

  );
};
{/* Final Page Button */}

export default BookingPage;