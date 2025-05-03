import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import FirebaseConfig from './FirebaseConfig';

const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [cityDetails, setCityDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cities/${cityName}/details`);
        setCityDetails(response.data);
      } catch (error) {
        toast.error('Failed to fetch city details.');
        console.error('Error fetching city details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCityDetails();
  }, [cityName]);
  const firebaseApp = initializeApp(FirebaseConfig);
  const auth = getAuth(firebaseApp);
  let user_id = null; // Initialize user_id to null
  const user = auth.currentUser; // Get the current user
  if (user) {
    console.log('User is logged in:', user.email);
    user_id=user.uid;
    console.log('User ID:', user.uid);
  } else {  
    console.log('No user is logged in');
  }

  


  const handleCardClick = (restaurant, city, price) => {
    axios.post('http://localhost:5000/api/packages', {
      restaurant,
      city,
      price,  
      user_id
    })
    .then((response) => {
      toast.success('Hotel selected successfully!');
      console.log('Data saved successfully:', response);
    })
    .catch((error) => {
      toast.error('Failed to save hotel data.');
      console.error('Error saving hotel data:', error);
    });

    navigate(`${cityName}/${restaurant}/bookings`);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeInOut', when: 'beforeChildren', staggerChildren: 0.2 }
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#212121] text-[#FFD700]">
        <h2 className="text-2xl">Loading City Details...</h2>
      </div>
    );
  }

  if (!cityDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#212121] text-[#FFD700]">
        <h2 className="text-2xl">City Not Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#212121] text-[#F5F5F5] font-sans">
      <ToastContainer />
      <motion.div
        className="container mx-auto px-4 py-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl font-bold text-center text-[#FFD700] mb-6">
          {cityDetails.city}
        </h1>

        {cityDetails.hotels && cityDetails.hotels.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4 text-center">
              Hotels in {cityDetails.city}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityDetails.hotels.map((hotel, index) => (
                <motion.div
                  key={index}
                  className="bg-[#2D2D2D] p-6 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                  variants={cardVariants}
                  onClick={() => handleCardClick(hotel.name, cityDetails.city, hotel.price)}
                >
                  <h3 className="text-xl font-semibold text-[#FFD700] mb-2">{hotel.name}</h3>
                  <p className="text-[#BDBDBD] mb-2">Rating: {hotel.rating || 'N/A'}</p>
                  <p className="text-[#BDBDBD] mb-2">Price: ₹{hotel.price}</p>
                  <p className="text-[#BDBDBD]">{hotel.description || 'No description available.'}</p>

                  {hotel.features && (
                    <div className="mt-4">
                      <h4 className="text-[#FFD700] font-bold text-lg mb-2">Features:</h4>
                      <ul className="list-disc pl-5 text-[#BDBDBD]">
                        {Object.values(hotel.features).map((feature, i) => (
                          <li key={i}>{feature || 'N/A'}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <h2 className="text-2xl text-center">No Hotels Found in {cityDetails.city}</h2>
        )}
      </motion.div>
    </div>
  );
};

export default CityDetail;
