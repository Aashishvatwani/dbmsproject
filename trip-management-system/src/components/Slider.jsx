import React, { useEffect, useState, useRef } from 'react';

const images = [
  'https://img.freepik.com/free-photo/full-shot-travel-concept-with-landmarks_23-2149153258.jpg?semt=ais_hybrid&w=740',

'https://images.unsplash.com/photo-1506744038136-46273834b3fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8c2VhcmNofDIwfHx0cmF2ZWx8ZW58MHx8fHwxNjg4NDI4ODU3&ixlib=rb-4.0.3&q=80&w=1920',

'https://img.freepik.com/free-photo/travel-concept-with-worldwide-landmarks_23-2149153263.jpg?t=st=1745675832~exp=1745679432~hmac=2035620bcef57941c50619898e4682903357fff50009b6f3c74168225944f8ed&w=996',

'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8c2VhcmNofDQwfHx0cmF2ZWx8ZW58MHx8fHwxNjg4NDI4ODU3&ixlib=rb-4.0.3&q=80&w=1920',

'https://img.freepik.com/free-photo/rear-view-back-young-asian-hiking-man-standing-riseup-hands-with-happy-peak-rocky-mountain-copy-space_1150-57186.jpg?ga=GA1.1.1767966689.1737279095&semt=ais_hybrid&w=740',

'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8c2VhcmNofDUwfHx0cmF2ZWx8ZW58MHx8fHwxNjg4NDI4ODU3&ixlib=rb-4.0.3&q=80&w=1920',

'https://www.ey.com/adobe/dynamicmedia/deliver/dm-aid--cf0890d8-bef6-4775-97ac-25c96c5080ff/ey-traveller-2.jpg?preferwebp=true&quality=85',

'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8c2VhcmNofDc2fHx0cmF2ZWx8ZW58MHx8fHwxNjg4NDI4ODU3&ixlib=rb-4.0.3&q=80&w=1920',

'https://img.freepik.com/free-photo/airport-terminal_1417-1456.jpg?ga=GA1.1.1767966689.1737279095&semt=ais_hybrid&w=740',

'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MTMyMXwwfDF8c2VhcmNofDEwMHx8dHJhdmVsfGVufDB8fHx8MTY4ODQyODg1Nw&ixlib=rb-4.0.3&q=80&w=1920',

];

const TravelMomentsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const startSlider = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 2000);
  };

  useEffect(() => {
    startSlider();
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="w-full bg-[#212121] py-12"> {/* Dark Background */}
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#FFD700] mb-4">Travel Moments</h2> {/* Golden Title */}
        <p className="text-lg md:text-xl font-medium text-[#F5F5F5] opacity-75 mb-8"> {/* Light Text */}
          ✨ Relive the <span className="text-[#E53935] font-semibold">beautiful sights</span> and {/* Red Highlight */}
          <span className="text-[#E53935] font-semibold"> unforgettable memories</span> captured during amazing trips.
        </p>

        <div
          className="flex justify-center items-center overflow-hidden w-full h-[300px] md:h-[450px] relative rounded-xl shadow-lg " 
          aria-live="polite"
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Travel Moment ${index + 1}`}
              loading="lazy"
              className={`absolute transition-all duration-1000 ease-in-out rounded-lg shadow-xl
                ${index === currentIndex ? 'scale-110 brightness-100 opacity-100 z-10' : 'scale-100 brightness-50 opacity-0 z-0'}
                w-auto max-h-[90%] object-cover`} 
              style={{ borderColor: '#795548' }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelMomentsSection;