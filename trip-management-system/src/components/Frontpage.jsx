import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import TravelMomentsSection from './Slider';
import BlogPostSlider from './BlogPostSlider';
import { useNavigate } from 'react-router-dom';
const FrontPage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showStars, setShowStars] = useState(false);
  const heroRef = useRef(null);
  const pricingRef = useRef(null);
  const blogRef = useRef(null);
  const contactRef = useRef(null);
  const featuredRef = useRef(null);
  const whyUsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login'); // 👈 this takes you to the login page
  };
  const handleSignupClick = () => {
    navigate('/signup'); // 👈 this takes you to the login page
  };
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const offsets = {
        home: heroRef.current?.offsetTop || 0,
        featured: featuredRef.current?.offsetTop || 0,
        pricing: pricingRef.current?.offsetTop || 0,
        whyUs: whyUsRef.current?.offsetTop || 0,
        testimonials: testimonialsRef.current?.offsetTop || 0,
        blog: blogRef.current?.offsetTop || 0,
        contact: contactRef.current?.offsetTop || 0,
        faq: faqRef.current?.offsetTop || 0,
      };

      if (y >= offsets.contact) setActiveSection('contact');
      else if (y >= offsets.blog) setActiveSection('blog');
      else if (y >= offsets.testimonials) setActiveSection('testimonials');
      else if (y >= offsets.whyUs) setActiveSection('whyUs');
      else if (y >= offsets.pricing) setActiveSection('pricing');
      else if (y >= offsets.featured) setActiveSection('featured');
      else setActiveSection('home');
      setShowStars(y >= offsets.pricing);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (ref) => {
    window.scrollTo({ top: ref.current?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new URLSearchParams({
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    });
    try {
      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbz_euJxhz4mezoGQUYL240aIXJk-QnrN064lCzKdvnwyZWOQMamBEjJtYendZGoWRrp/exec?${data}`,
        { method: 'POST' }
      );
      if (res.ok) {
        alert('Message sent!');
        e.target.reset();
      } else alert('Failed to send');
    } catch {
      alert('Error sending message');
    }
  };

  const packages = [
    { title: 'Goa Getaway', price: '₹12,000', features: ['3N/4D', 'Beach Resort', 'Water Sports', 'Breakfast', 'Airport Transfer'] },
    { title: 'Manali Adventure', price: '₹15,000', features: ['4N/5D', 'Mountain Cottage', 'Snow Trek', 'All Meals', 'Local Tours'] },
    { title: 'Jaipur Heritage', price: '₹9,500', features: ['2N/3D', 'Bus Travel', 'Guided Tours', 'Cultural Show', 'Hotel Stay'] },
  ];

  const featuredDestinations = [
    { name: 'Paris', image: 'https://via.placeholder.com/300x200/FFD700/333?Text=Paris', description: 'City of Love', price: '₹50,000' },
    { name: 'Bali', image: 'https://via.placeholder.com/300x200/E53935/333?Text=Bali', description: 'Island of Gods', price: '₹40,000' },
    { name: 'Rome', image: 'https://via.placeholder.com/300x200/795548/eee?Text=Rome', description: 'Ancient History', price: '₹45,000' },
  ];

  const advantages = [
    { icon: 'fa-check-circle', title: 'Best Prices', description: 'Guaranteed best prices on all bookings.' },
    { icon: 'fa-globe', title: 'Wide Selection', description: 'Explore a vast range of destinations and accommodations.' },
    { icon: 'fa-lock', title: 'Secure Booking', description: 'Safe and secure booking process.' },
    { icon: 'fa-headphones', title: '24/7 Support', description: 'Dedicated customer support around the clock.' },
  ];

  const testimonialsData = [
    { name: 'John Doe', quote: 'Amazing experience! Highly recommended.', image: 'https://via.placeholder.com/50x50/F5F5F5/333?Text=JD' },
    { name: 'Jane Smith', quote: 'Easy booking and great service.', image: 'https://via.placeholder.com/50x50/F5F5F5/333?Text=JS' },
  ];

  const faqsData = [
    { question: 'What is your cancellation policy?', answer: 'Our cancellation policy varies depending on the booking...' },
    { question: 'Do you offer travel insurance?', answer: 'Yes, we offer various travel insurance options...' },
  ];

  return (
    <div className="relative font-sans bg-[#212121] text-[#F5F5F5]">
      {/* Navbar */}
      <nav className="fixed w-full bg-[#333333] bg-opacity-95 backdrop-blur p-4 flex justify-center z-20 shadow-lg">
        {['home', 'featured', 'pricing', 'whyUs', 'testimonials', 'blog', 'contact', 'faq'].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection({
              home: heroRef,
              featured: featuredRef,
              pricing: pricingRef,
              whyUs: whyUsRef,
              testimonials: testimonialsRef,
              blog: blogRef,
              contact: contactRef,
              faq: faqRef,
            }[section])}
            className={`mx-2 md:mx-4 uppercase tracking-wide transition ${
              activeSection === section ? 'text-[#FFD700] font-semibold' : 'text-[#BDBDBD] hover:text-[#FFD700]'
            }`}
          >
            {section}
          </button>
        ))}
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080?text=Explore+the+World')" }}
      >
        <div className="bg-[#333333] bg-opacity-80 p-8 rounded-2xl text-center">
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4">Your Trip Awaits</h1>
          <p className="text-lg text-[#F5F5F5] opacity-75 mb-6">Discover incredible destinations and book your adventure.</p>
          <div className="space-x-4">
            <button href="#" className="px-6 py-3 bg-[#E53935] rounded-lg text-[#F5F5F5] hover:bg-[#D32F2F] transition " onClick={handleLoginClick}>Login</button>
            <button href="#" className="px-6 py-3 bg-[#E53935] rounded-lg text-[#F5F5F5] hover:bg-[#D32F2F] transition" onClick={handleSignupClick}>Sign Up</button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section ref={featuredRef} className="py-16 bg-[#2D2D2D]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-8">Featured Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((dest, index) => (
              <div
                key={index}
                className="bg-[#424242] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform duration-500 hover:scale-110 transition-shadow duration-300" // Added cursor-pointer and hover effect
              >
                <img src={dest.image} alt={dest.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#FFD700] mb-2">{dest.name}</h3>
                  <p className="text-[#F5F5F5] opacity-75 mb-3">{dest.description}</p>
                  <p className="text-[#E53935] font-bold">Starting from ₹{dest.price}</p>
                  <button className="mt-4 px-4 py-2 bg-[#E53935] text-[#F5F5F5] rounded-md hover:bg-[#D32F2F] transition">View Deals</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Slider */}
      <div className="py-12 bg-[#333333]">
        <h2 className="text-2xl text-center text-[#FFD700] font-semibold mb-6">Places to Visit</h2>
        <TravelMomentsSection />
      </div>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-16 bg-[#2D2D2D]">
        <h2 className="text-4xl text-center text-[#FFD700] font-bold mb-12">Exclusive Packages</h2>
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              className="p-6 bg-[#424242] rounded-2xl shadow-lg border border-[#795548] cursor-pointer hover:shadow-lg transition-transform duration-500 hover:scale-110 transition-shadow duration-300" // Added cursor-pointer and hover effect
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-[#FFD700] mb-2">{pkg.title}</h3>
              <p className="text-xl font-bold text-[#F5F5F5] mb-4">{pkg.price}</p>
              <ul className="list-disc list-inside text-[#BDBDBD] mb-6">
                {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <button className="w-full py-2 bg-[#E53935] text-[#F5F5F5] rounded-lg hover:bg-[#D32F2F] transition">Book Now</button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={whyUsRef} className="py-16 bg-[#333333]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((adv, index) => (
              <div
                key={index}
                className="bg-[#424242] rounded-lg p-6 cursor-pointer hover:shadow-lg hover:scale-110 transition-transform duration-500 hover:scale-110 transition-shadow duration-300" // Added cursor-pointer and hover effect
              >
                <i className={`fas ${adv.icon} text-2xl text-[#E53935] mb-4`}></i> {/* Font Awesome Icons */}
                <h3 className="text-xl font-semibold text-[#FFD700] mb-2">{adv.title}</h3>
                <p className="text-[#F5F5F5] opacity-75">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-16 bg-[#2D2D2D]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-8">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#424242] rounded-lg p-6 cursor-pointer hover:shadow-lg transition-transform duration-500 hover:scale-105 transition-shadow duration-300" // Added cursor-pointer and hover effect
              >
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mx-auto mb-4" />
                <p className="text-[#F5F5F5] italic mb-3">"{testimonial.quote}"</p>
                <h4 className="text-[#FFD700] font-semibold">- {testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section ref={blogRef} className="py-16 bg-[#333333]">
        <h2 className="text-3xl text-center text-[#FFD700] font-bold mb-8">Latest Blog Posts</h2>
        <BlogPostSlider />
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-16 bg-[#2D2D2D]">
        <h2 className="text-4xl text-center text-[#FFD700] font-bold mb-6">Contact Us</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <input name="name" type="text" placeholder="Name" className="w-full p-3 rounded-lg border border-[#795548] bg-[#424242] text-[#F5F5F5] focus:ring-2 focus:ring-[#FFD700]" required />
          <input name="email" type="email" placeholder="Email" className="w-full p-3 rounded-lg border border-[#795548] bg-[#424242] text-[#F5F5F5] focus:ring-2 focus:ring-[#FFD700]" required />
          <textarea name="message" rows="4" placeholder="Message" className="w-full p-3 rounded-lg border border-[#795548] bg-[#424242] text-[#F5F5F5] focus:ring-2 focus:ring-[#FFD700]" required />
          <button type="submit" className="w-full py-3 bg-[#E53935] text-[#F5F5F5] rounded-lg hover:bg-[#D32F2F] transition">Send Message</button>
        </form>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-16 bg-[#333333]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-8">Frequently Asked Questions</h2>
          <div className="max-w-lg mx-auto space-y-4">
            {faqsData.map((faq, index) => (
              <div
                key={index}
                className="bg-[#424242] rounded-lg p-6 text-left cursor-pointer hover:shadow-lg transition-transform duration-500 hover:scale-110 transition-shadow duration-300" // Added cursor-pointer and hover effect
              >
                <h4 className="text-[#FFD700] font-semibold mb-2">{faq.question}</h4>
                <p className="text-[#F5F5F5] opacity-75">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-[#212121] text-center text-[#BDBDBD] border-t border-[#795548]">
        &copy; {new Date().getFullYear()} Your Trip Planner | Contact: +91 86902 43735
      </footer>
    </div>
  );
};

export default FrontPage;