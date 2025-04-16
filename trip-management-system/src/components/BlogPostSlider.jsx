import { useEffect, useState, useRef } from 'react';

const blogPosts = [
  {
    title: 'Top 5 Budget-Friendly Indian Destinations',
    date: 'April 10, 2025',
    excerpt: 'Travel on a budget without missing out on unforgettable experiences.'
  },
  {
    title: 'Packing Tips for Every Type of Trip',
    date: 'April 03, 2025',
    excerpt: 'Learn how to pack smart, save space, and avoid travel headaches.'
  },
  {
    title: 'Why Solo Travel is Good for You',
    date: 'March 25, 2025',
    excerpt: 'Discover yourself through the joy of solo exploration.'
  },
  {
    title: 'Monsoon Escapes: Best Places to Visit During Rainy Season',
    date: 'March 20, 2025',
    excerpt: 'Embrace the rain with these stunning monsoon travel destinations.'
  },
  {
    title: 'Weekend Getaways Near Delhi You Shouldn’t Miss',
    date: 'March 12, 2025',
    excerpt: 'Short on time? These quick trips offer a refreshing break.'
  },
  {
    title: 'Top 7 Tips for First-Time International Travelers',
    date: 'March 05, 2025',
    excerpt: 'Make your first trip abroad smooth and unforgettable.'
  },
  {
    title: 'Must-Have Travel Apps for 2025',
    date: 'February 25, 2025',
    excerpt: 'Tech that helps you navigate, book, and enjoy your trips better.'
  },
  {
    title: 'Best Foodie Destinations Across India',
    date: 'February 18, 2025',
    excerpt: 'A treat for your taste buds — discover regional culinary gems.'
  },
  {
    title: 'Mountain vs Beach: What’s Your Perfect Trip?',
    date: 'February 10, 2025',
    excerpt: 'Explore the pros of each and decide your next destination.'
  }
];

const BlogPostSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!transitioning) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setTransitioning(true);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [transitioning]);

  useEffect(() => {
    if (transitioning) {
      const transitionEndHandler = () => {
        if (currentIndex === blogPosts.length) {
          setCurrentIndex(0);
          if (sliderRef.current) {
            sliderRef.current.style.transitionDuration = '0ms'; // Temporarily disable transition for the reset
            sliderRef.current.style.transform = `translateX(0%)`;
            // Force a reflow to apply the style change immediately
            sliderRef.current.offsetHeight;
            sliderRef.current.style.transitionDuration = '1000ms'; // Re-enable transition
          }
        }
        setTransitioning(false);
      };

      if (sliderRef.current) {
        sliderRef.current.addEventListener('transitionend', transitionEndHandler);
      }

      return () => {
        if (sliderRef.current) {
          sliderRef.current.removeEventListener('transitionend', transitionEndHandler);
        }
      };
    }
  }, [currentIndex, transitioning]);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-md">
      <div
        ref={sliderRef}
        className="flex transition-transform duration-[1000ms] ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {blogPosts.map((post, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full h-64 md:h-72 lg:h-80 flex items-center justify-center p-6"
            style={{
              backgroundColor: index % 2 === 0 ? '#374151' : '#4B5563', // Alternating dark background
              transform: currentIndex === index ? 'scale(1.15)' : 'scale(0.9)', // More pronounced scale
              transition: 'transform 1s ease-in-out, box-shadow 0.5s ease-in-out', // Added box-shadow transition
              boxShadow: currentIndex === index ? '0 8px 16px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.2)', // Stronger shadow for active
              zIndex: currentIndex === index ? 10 : 1, // Ensure active item is above others
            }}
          >
            <div className="text-center max-w-xl">
              <h2 className="text-2xl font-bold text-[#FFD700] mb-2">{post.title}</h2> {/* Golden Title */}
              <p className="text-[#E53935] text-sm mb-4">{post.date}</p> {/* Red Date */}
              <p className="text-[#F5F5F5] text-base">{post.excerpt}</p> {/* Light Text */}
            </div>
          </div>
        ))}
        {/* Duplicate the first item for seamless loop */}
        <div
          key={blogPosts.length}
          className="flex-shrink-0 w-full h-64 md:h-72 lg:h-80 flex items-center justify-center p-6"
          style={{
            backgroundColor: blogPosts.length % 2 === 0 ? '#374151' : '#4B5563', // Match background
            opacity: 0,
            position: 'absolute',
            pointerEvents: 'none',
          }}
        >
          <div className="text-center max-w-xl">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-2">{blogPosts[0].title}</h2>
            <p className="text-[#E53935] text-sm mb-4">{blogPosts[0].date}</p>
            <p className="text-[#F5F5F5] text-base">{blogPosts[0].excerpt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostSlider;