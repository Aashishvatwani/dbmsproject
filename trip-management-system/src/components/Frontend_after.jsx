import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';
import cities from './hello.json';
import GlobeModel from './Globe'; // Assuming you have a GlobeModel component
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Logout from './Logout';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const FrontPage_after = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [city, setCity] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityList, setCityList] = useState(cities);
  const [restaurantList, setRestaurantList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Create refs for each section
  const aboutSection = useRef(null);
  const testimonialsSection = useRef(null);
  const pricingSection = useRef(null);
  const packageSection = useRef(null);
  const citySearchSection = useRef(null);

  const scrollToSection = (elementRef, sectionName) => {
    window.scrollTo({
      top: elementRef.current.offsetTop - 60, // Adjust offset for navigation height if needed
      behavior: 'smooth',
    });
    setActiveSection(sectionName);
  };
  const particlesInit = async (main) => {
    await loadFull(main);
  };
  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      try {
        const response = await axios.get(`http://localhost:5000/api/cities/search-city?name=${term}`);
        setSearchResults(response.data.cities.slice(0, 5));
      } catch (error) {
        console.error('Error searching cities:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      navigate(`/home/${searchTerm}`);
    }
  };

  const handleCitySelect = (selectedCityName) => {
    setSearchTerm(selectedCityName);
    setSearchResults([]);
    setCity(selectedCityName);
  };

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

  const testimonialsData = [
    {
      name: 'Priya Sharma',
      text:
        'TravelX made our family vacation to Goa absolutely seamless and unforgettable. The custom itinerary was perfect, and the accommodations were top-notch. We especially loved the sunset cruise!',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      text:
        'The Manali adventure package was fantastic! Great accommodations and well-organized activities. The trekking and river rafting were highlights of our trip. Highly recommended.',
      rating: 4.8,
    },
    {
      name: 'Sneha Patel',
      text:
        "From booking to the guided tours in Jaipur, everything was top-notch. TravelX truly cares about their customers. The local guides were very knowledgeable, and we learned so much about the city's history.",
      rating: 5,
    },
    {
      name: 'John Smith',
      text:
        'I used TravelX for a solo trip to Kerala, and it was amazing.  I felt safe and everything was well organized.  I would definitely use them again.',
      rating: 4.5,
    },
  ];

  const pricingTiers = [
    {
      name: 'Budget Explorer',
      price: '₹15,000',
      features: [
        'Basic Accommodation',
        'Breakfast Included',
        'City Map',
        'Standard Transport',
      ],
    },
    {
      name: 'Adventure Seeker',
      price: '₹25,000',
      features: [
        'Comfort Stay',
        'Half-Board Meals',
        'Guided Activities',
        'Comfort Transport',
      ],
    },
    {
      name: 'Luxury Traveler',
      price: '₹40,000',
      features: [
        'Premium Suites',
        'All-Inclusive Meals',
        'Private Tours',
        'Luxury Transport',
        'Spa Access',
      ],
    },
  ];

  return (
    <div className="relative font-sans bg-[#212121] text-[#F5F5F5]">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 md:p-6 bg-[#2D2D2D] border-b border-[#424242] fixed top-0 left-0 right-0 z-20">
        <div className="text-2xl font-bold text-[#FFD700] tracking-wide">TravelX</div>
        <div className="space-x-4 md:space-x-6">
          <button
            onClick={() => scrollToSection(aboutSection, 'about')}
            className={
              activeSection === 'about'
                ? 'px-4 py-2 bg-[#424242] rounded-md text-[#F5F5F5]'
                : 'px-4 py-2 text-[#F5F5F5] hover:text-[#FFD700]'
            }
          >
            About
          </button>
          <button
            onClick={() => scrollToSection(testimonialsSection, 'testimonials')}
            className={
              activeSection === 'testimonials'
                ? 'px-4 py-2 bg-[#424242] rounded-md text-[#F5F5F5]'
                : 'px-4 py-2 text-[#F5F5F5] hover:text-[#FFD700]'
            }
          >
            Testimonials
          </button>
          <button
            onClick={() => scrollToSection(pricingSection, 'pricing')}
            className={
              activeSection === 'pricing'
                ? 'px-4 py-2 bg-[#424242] rounded-md text-[#F5F5F5]'
                : 'px-4 py-2 text-[#F5F5F5] hover:text-[#FFD700]'
            }
          >
            Pricing
          </button>
          <button
            onClick={() => navigate('/addhotel')}
            className={
              activeSection === 'package'
                ? 'px-4 py-2 bg-[#424242] rounded-md text-[#F5F5F5]'
                : 'px-4 py-2 text-[#F5F5F5] hover:text-[#FFD700]'
            }
          >
            Give Hotel Details
          </button>
        </div>
      </nav>

      {/* City Search Bar Section */}
      <Logout/>
      <section id="city-search" className="py-12 md:py-16 bg-[#212121] mt-16" ref={citySearchSection}>
        <div className="container mx-auto text-center">
          <motion.h2
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#FFD700] mb-6 md:mb-8 tracking-wide"
          >
            Explore Cities
          </motion.h2>

          <div className="relative w-full max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              className="w-full bg-[#424242] text-[#F5F5F5] border-0 rounded-lg shadow-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              placeholder="Search for a city..."
            />
            {searchResults.length > 0 && (
              <ul className="absolute left-0 right-0 bg-[#333333] text-[#F5F5F5] rounded-md shadow-lg mt-1 z-10">
                {searchResults.map((cityObj) => (
                  <li
                    key={cityObj._id}
                    className="py-2 px-4 hover:bg-[#555555] cursor-pointer"
                    onClick={() => handleCitySelect(cityObj.name)}
                  >
                    {cityObj.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Popular Cities Slider */}
      <section id="popular-cities" className="py-12 md:py-16 bg-[#212121]">
        <div className="container mx-auto text-center">
          <motion.h2
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#FFD700] mb-6 md:mb-8 tracking-wide"
          >
            Popular Destinations
          </motion.h2>
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={2}
            loop={true}
            freeMode={true}
            speed={3000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            className="w-full"
          >
            {cityList.slice(0, 10).map((city, index) => (
              <SwiperSlide key={city._id} className="pb-8">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                  className="flex flex-col items-center cursor-pointer h-full"
                  onClick={() => handleCitySelect(city.city)}
                >
                  <div className="bg-[#2D2D2D] p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col justify-between h-[350px] w-full">
                    <h3 className="text-2xl font-bold text-[#FFD700] tracking-wide text-center mb-2">
                      {city.city}
                    </h3>

                    <p className="text-[#BDBDBD] text-center text-sm mb-4 line-clamp-3">
                      {city.description || 'No description available.'}
                    </p>

                    {city.best_places_to_visit && city.best_places_to_visit.length > 0 && (
                      <div>
                        <h4 className="text-[#FFD700] font-semibold text-md mb-2 text-center">
                          Top Places:
                        </h4>
                        <ul className="text-[#BDBDBD] text-sm list-disc list-inside space-y-1">
                          {city.best_places_to_visit.slice(0, 4).map((place, i) => (
                            <li key={i}>{place}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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
        ref={aboutSection}
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6 md:mb-8 text-center tracking-wide">
            About Us
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#2D2D2D] border border-[#424242] rounded-lg p-6">
              <p className="text-[#BDBDBD] text-lg leading-relaxed">
                At TravelX, we believe that travel is more than just visiting a
                place; it's about creating lasting memories and enriching your
                life with new experiences.
              </p>
            </div>
            <div className="bg-[#2D2D2D] border border-[#424242] rounded-lg p-6">
              <p className="text-[#BDBDBD] text-lg leading-relaxed">
                Founded by a team of passionate travel enthusiasts right here in
                Chennai, we understand the unique needs and desires of Indian
                travelers.
              </p>
            </div>
            <div className="bg-[#2D2D2D] border border-[#424242] rounded-lg p-6">
              <p className="text-[#BDBDBD] text-lg leading-relaxed">
                Our mission is to provide you with meticulously crafted and
                personalized travel packages that cater to your individual
                preferences and budget.
              </p>
            </div>
            <div className="bg-[#2D2D2D] border border-[#424242] rounded-lg p-6 col-span-3">
              <p className="text-[#BDBDBD] text-lg leading-relaxed">
                We partner with trusted local experts and service providers to
                ensure you receive the highest quality accommodations,
                transportation, and guided tours. Whether you're dreaming of the
                serene beaches of Goa, the majestic mountains of Manali, or the
                vibrant culture of Jaipur, TravelX is here to turn your travel
                dreams into reality.
              </p>
            </div>
          </div>
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
        ref={testimonialsSection}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6 tracking-wide">
            Testimonials
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {testimonialsData.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.03, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#424242] p-6 rounded-lg shadow-md"
              >
                <p className="text-lg text-[#F5F5F5] italic mb-3">
                  &quot;{testimonial.text}&quot;
                </p>
                <h4 className="text-sm font-semibold text-[#FFD700]">
                  - {testimonial.name}
                </h4>
                <div className="flex items-center justify-center mt-2">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                    key={i}
                    className="w-4 h-4 fill-current text-yellow-500 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.176-6.545L.587 6.905l6.545-.952L10 0l2.868 5.953 6.545.952-4.765 4.64 1.176 6.545z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
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
      ref={pricingSection}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#FFD700] mb-6 tracking-wide">
          Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: '0px 7px 14px rgba(0, 0, 0, 0.4)' }}
              whileTap={{ y: 0 }}
              className="bg-[#2D2D2D] p-8 rounded-lg shadow-md flex flex-col items-center"
            >
              <h3 className="text-xl font-bold text-[#FFD700] mb-4">
                {tier.name}
              </h3>
              <p className="text-3xl font-semibold text-[#F5F5F5] mb-4">
                {tier.price}
              </p>
              <ul className="text-sm text-[#BDBDBD] text-left w-full">
                {tier.features.map((feature, i) => (
                  <li key={i} className="mb-2">
                    <svg
                      className="w-4 h-4 fill-current text-[#FFD700] inline mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* Create Package globe */}
    <section className="relative bg-[#121212] py-24 text-center overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          fullScreen: { enable: false },
          background: { color: "#121212" },
          particles: {
            number: { value: 100 },
            color: { value: "#FFD700" },
            links: {
              enable: true,
              color: "#FFD700",
              distance: 140,
              opacity: 0.4,
              width: 1,
            },
            move: { enable: true, speed: 1.2 },
            opacity: { value: 0.6 },
            size: { value: { min: 1, max: 4 } },
          },
        }}
      />

      {/* Radial Glow Circle */}
      <div className="absolute -top-48 left-1/2 transform -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#FFD700]/30 to-transparent opacity-25 rounded-full blur-[120px] z-0"></div>

      {/* Heading */}
      <h2 className="text-5xl md:text-6xl font-extrabold text-[#FFD700] z-10 relative drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
        Are you Ready to Explore World
      </h2>

      {/* Globe Image + CTA */}
      <div className="mt-12 relative z-10">
        <img
          src="/earth.svg"
          alt="Globe Hologram"
          className="w-72 mx-auto animate-[spin_30s_linear_infinite] hover:scale-110 transition-transform duration-700"
        />
        <p className="mt-5 text-gray-300 text-lg italic">
          Your journey starts now...
        </p>
        <button className="mt-6 px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-full text-lg shadow-lg hover:bg-yellow-400 transition-transform hover:scale-105 duration-300">
          Explore Now →
        </button>
      </div>
    </section>
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