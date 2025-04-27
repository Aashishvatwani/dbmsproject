import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
// Import Swiper core and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay,FreeMode } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';

const FrontPage_after = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [city, setCity] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);

  const handleCityChange = async (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setRestaurant('');
    setPackageDetails(null);
    if (selectedCity) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/restaurants?city=${selectedCity}`
        );
        setRestaurantList(response.data.restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setRestaurantList([]);
      }
    } else {
      setRestaurantList([]);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cities');
        setCityList(response.data.cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleRestaurantChange = (e) => {
    setRestaurant(e.target.value);
    setPackageDetails(null);
  };

  const generatePackage = async () => {
    if (city && restaurant) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/api/packages', {
          city,
          restaurant,
        });
        console.log('Package Data:', response.data);

        setPackageDetails({
          title: response.data.package.package_name,
          price: `₹${response.data.package.price}`,
          features: [
            'Custom Stay',
            'Meals Included',
            'Transport Included',
            'Guided Tour',
          ],
        });
      } catch (error) {
        console.error('Error fetching package:', error);
        setPackageDetails({
          title: 'Error Generating Package',
          price: 'Please try again.',
          features: [],
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
    hover: { scale: 1.05, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', transition: { duration: 0.2 } },
  };

  return (
    <div className="relative font-sans bg-[#212121] text-[#F5F5F5]">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 md:p-6 bg-[#2D2D2D] border-b border-[#424242]">
        <div className="text-2xl font-bold text-[#FFD700] tracking-wide">TravelX</div>
        <div className="space-x-4 md:space-x-6">
          <button
            onClick={() => setActiveSection('about')}
            className={
              activeSection === 'about'
                ? 'px-4 py-2 bg-[#424242] rounded-md text-[#F5F5F5]'
                : 'px-4 py-2 text-[#F5F5F5] hover:text-[#FFD700]'
            }
          >
            About
          </button>
          <button
            onClick={() => setActiveSection('testimonials')}
            className={
              activeSection === 'testimonials'
                ? 'px-4 py-2 bg-[#424242] rounded-md text-[#F5F5F5]'
                : 'px-4 py-2 text-[#F5F5F5] hover:text-[#FFD700]'
            }
          >
            Testimonials
          </button>
          <button
            onClick={() => setActiveSection('pricing')}
            className={
              activeSection === 'pricing'
                ? 'px-4 py-2 bg-[#424242] rounded-md text-[#F5F5F5]'
                : 'px-4 py-2 text-[#F5F5F5] hover:text-[#FFD700]'
            }
          >
            Pricing
          </button>
          <button
            onClick={() => setActiveSection('package')}
            className={
              activeSection === 'package'
                ? 'px-4 py-2 bg-[#424242] rounded-md text-[#F5F5F5]'
                : 'px-4 py-2 text-[#F5F5F5] hover:text-[#FFD700]'
            }
          >
            Create Package
          </button>
        </div>
      </nav>
      {/* cities section */}
      <section id="cities" className="py-12 md:py-16 bg-[#212121]">
        <div className="container mx-auto text-center">
          <motion.h2
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#FFD700] mb-6 md:mb-8 tracking-wide"
          >
            Popular Cities
          </motion.h2>
         


        <Swiper
  modules={[Autoplay, FreeMode]}
  spaceBetween={20}
  slidesPerView={3}     // or "auto" for dynamic widths
  loop={true}
  freeMode={true}
  speed={3000}          // duration (ms) to scroll one “screen”
  autoplay={{
    delay: 0,
    disableOnInteraction: false,
  }}
  className="w-full"
        >
+          
            {cityList.map((city) => (
              <SwiperSlide key={city._id} className="pb-8">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                  className="flex flex-col items-center"
                >
                  <img
                    src={city.imageUrl}
                    alt={city.name}
                    className="h-64 w-full object-cover rounded-lg mb-4 shadow-lg"
                  />
                  <h3 className="text-2xl font-bold text-[#FFD700] tracking-wide">{city.name}</h3>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* About Section */}
      <motion.section
        id="about"
        className="py-12 md:py-16 bg-[#212121]"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-4 md:mb-6 tracking-wide">About Us</h2>
          <p className="text-[#BDBDBD] max-w-2xl mx-auto text-lg leading-relaxed">
            Welcome to TravelX, your trusted travel companion. We provide custom
            packages with unforgettable experiences tailored for you!
          </p>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        id="testimonials"
        className="py-12 md:py-16 bg-[#2D2D2D]"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6 tracking-wide">Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-[#424242] shadow-md rounded-lg">
              <div className="p-4 md:p-6">
                <p className="text-[#BDBDBD] text-lg italic">
                  &quot;Amazing service! Highly recommend TravelX for all travel needs!&quot;
                </p>
                <h4 className="mt-4 font-bold text-[#FFD700] tracking-wide">- Priya Sharma</h4>
              </div>
            </div>
            <div className="bg-[#424242] shadow-md rounded-lg">
              <div className="p-4 md:p-6">
                <p className="text-[#BDBDBD] text-lg italic">
                  &quot;Our family trip to Manali was seamless and beautiful thanks to
                  TravelX!&quot;
                </p>
                <h4 className="mt-4 font-bold text-[#FFD700] tracking-wide">- Rohan Mehta</h4>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        id="pricing"
        className="py-12 md:py-16 bg-[#212121]"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6 tracking-wide">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-[#424242] shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] rounded-lg">
              <div className="p-4 md:p-6">
                <h3 className="text-2xl text-[#FFD700] tracking-wide">Basic</h3>
                <p className="text-xl mt-2 mb-4 text-[#F5F5F5]">₹5,000 - ₹10,000</p>
                <ul className="list-disc list-inside text-[#BDBDBD] space-y-2">
                  <li>3 Days Stay</li>
                  <li>Breakfast Included</li>
                  <li>Basic Transport</li>
                </ul>
              </div>
            </div>
            <div className="bg-[#424242] shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] rounded-lg">
              <div className="p-4 md:p-6">
                <h3 className="text-2xl text-[#FFD700] tracking-wide">Standard</h3>
                <p className="text-xl mt-2 mb-4 text-[#F5F5F5]">₹10,000 - ₹20,000</p>
                <ul className="list-disc list-inside text-[#BDBDBD] space-y-2">
                  <li>5 Days Stay</li>
                  <li>All Meals Included</li>
                  <li>Local Guide</li>
                </ul>
              </div>
            </div>
            <div className="bg-[#424242] shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] rounded-lg">
              <div className="p-4 md:p-6">
                <h3 className="text-2xl text-[#FFD700] tracking-wide">Premium</h3>
                <p className="text-xl mt-2 mb-4 text-[#F5F5F5]">₹20,000+</p>
                <ul className="list-disc list-inside text-[#BDBDBD] space-y-2">
                  <li>Luxury Hotels</li>
                  <li>All Meals + Activities</li>
                  <li>Personal Driver</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Create Package Section */}
      <motion.section
        id="package"
        className="py-12 md:py-16 bg-[#2D2D2D]"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6 md:mb-8 tracking-wide">
            Create Your Package
          </h2>

          {/* City Selection */}
          <div className="mb-4 md:mb-6 w-full max-w-md mx-auto">
            <label htmlFor="city" className="block text-sm font-medium text-[#F5F5F5] mb-2">
              Select City:
            </label>
            <select
              id="city"
              value={city}
              onChange={handleCityChange}
              className="w-full bg-[#424242] text-[#F5F5F5] border-0 rounded-lg shadow-md py-3 px-4"
            >
              <option value="" disabled>Select a City</option>
              {cityList.map((cityOption) => (
                <option key={cityOption._id} value={cityOption.name} className="hover:bg-[#616161] text-[#F5F5F5]">
                  {cityOption.name}
                </option>
              ))}
            </select>
          </div>

          {/* Restaurant Selection */}
          <div className="mb-4 md:mb-6 w-full max-w-md mx-auto">
            <label htmlFor="restaurant" className="block text-sm font-medium text-[#F5F5F5] mb-2">
              Select Restaurant:
            </label>
            <select
              id="restaurant"
              value={restaurant}
              onChange={handleRestaurantChange}
              disabled={!city}
              className={
                !city
                  ? "w-full bg-[#424242] text-[#F5F5F5] border-0 rounded-lg shadow-md py-3 px-4 opacity-50 cursor-not-allowed"
                  : "w-full bg-[#424242] text-[#F5F5F5] border-0 rounded-lg shadow-md py-3 px-4"
              }
            >
              <option value="" disabled>Select a Restaurant</option>
              {restaurantList.map((restaurantOption) => (
                <option key={restaurantOption._id} value={restaurantOption.name} className="hover:bg-[#616161] text-[#F5F5F5]">
                  {restaurantOption.name}
                </option>
              ))}
            </select>
          </div>

          {/* Button to generate the package */}
          <button
            onClick={generatePackage}
            className="px-6 py-3 bg-[#E53935] text-[#F5F5F5] rounded-lg hover:bg-[#D32F2F] transition-colors shadow-md hover:shadow-lg"
            disabled={!city || !restaurant || loading}
          >
            {loading ? 'Generating...' : 'Generate Package'}
          </button>

          {/* Show generated package details */}
          {packageDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8 bg-[#424242] p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-[#FFD700] tracking-wide">
                {packageDetails.title}
              </h3>
              <p className="text-xl text-[#F5F5F5] mb-4">{packageDetails.price}</p>
              {Array.isArray(packageDetails.features) && (
                <ul className="list-disc list-inside text-[#BDBDBD] space-y-2">
                  {packageDetails.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-4 md:py-6 bg-[#2D2D2D] text-center border-t border-[#424242]">
        <p className="text-[#BDBDBD] text-sm">
          &copy; {new Date().getFullYear()} TravelX. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default FrontPage_after;

