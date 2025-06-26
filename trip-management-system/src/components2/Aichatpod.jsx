import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function CityQuestionPopup() {
  const [city, setCity] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // Now stores { heading: "...", facts: [...] }

  // Fetch city
  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/finals");
        setCity(res.data[0]?.package_city || "your city");
      } catch (err) {
        console.error("Error fetching city:", err);
      }
    };
    fetchCity();
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse(null); // Clear previous response

    try {
      const res = await axios.post("http://localhost:5000/api/ask", {
        city,
        content1: question,
      });
      // Set the entire data object including heading and facts
      setResponse(res.data);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-4 left-4 z-50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
        >
          <motion.div
            className="bg-white dark:bg-zinc-900 text-black dark:text-white p-4 rounded-xl shadow-lg w-[320px] border border-zinc-300 relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <img
                src="https://img.icons8.com/ios-filled/50/robot-2.png"
                alt="Robot"
                className="w-8 h-8"
              />
              <h2 className="text-sm font-semibold">Ask about {city}</h2>
            </div>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
              className="w-full px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <button
              onClick={handleAsk}
              disabled={loading}
              className="mt-2 w-full bg-blue-600 text-white text-sm py-1.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Asking..." : "Ask"}
            </button>

            <div className="mt-2 text-xs text-gray-400">
              <p className="mb-1">💡 Suggestions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>What's special in {city}?</li>
                <li>Tourist spots?</li>
                <li>Local foods?</li>
              </ul>
            </div>

            {/* Render the response, including the heading */}
            {response && (
              <motion.div
                className="mt-3 bg-blue-50 dark:bg-zinc-800 p-3 rounded-md text-sm text-black dark:text-white space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <strong className="text-blue-600 dark:text-blue-400 block mb-2">Response:</strong>

                {/* --- Highlighted Heading Section --- */}
                {response.heading && (
                  <h3 className="response-heading text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">
                    {response.heading}
                  </h3>
                )}

                {/* --- Bullet Points (Facts) Section --- */}
                {response.facts && Array.isArray(response.facts) && response.facts.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {response.facts.map((point, idx) => (
                      <li key={idx} className="leading-snug">
                        {/* Remove leading asterisks, hyphens, or spaces */}
                        {point.replace(/^[-*\s]+/, "")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  // Fallback for when there are no specific facts or if response.facts is just a string
                  // Ensure to clean up if it's a single string too
                  response.facts && <li>{String(response.facts).replace(/^[-*\s]+/, "")}</li>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-3 w-full bg-red-500 text-white text-xs py-1.5 rounded-md hover:bg-red-600 transition cursor-pointer"
                >
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}