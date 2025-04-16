import React, { useEffect, useState, useRef } from 'react';

const images = [
  'https://images.unsplash.com/photo-1726137569872-28e3f796d4a2?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1742201876722-85a042294575?q=80&w=1965&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1741610748460-fb2e33cc6390?q=80&w=1972&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1741648711665-e1a8003b7891?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1741462166411-b94730c55171?q=80&w=1970&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1741732311554-911ecc8da478?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1743021192899-5e78625bf0c7?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1741851374655-3911c1b0e95a?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1741850820831-e244e5b39111?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1741851373451-59e7260fe72c?q=80&w=1974&auto=format&fit=crop',
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
          className="flex justify-center items-center overflow-hidden w-full h-[300px] md:h-[450px] relative rounded-xl shadow-lg border border-[#795548]" 
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