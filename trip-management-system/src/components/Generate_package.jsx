import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HotelInfoForm = () => {
  const [hotel, setHotel] = useState({
    name: "",
    city: "",
    price: 2000,
    rating: 3,
    description: "",
    features: [""],
  });

  const [interestingFacts, setInterestingFacts] = useState([]);
  const [loadingFacts, setLoadingFacts] = useState(false);
  const [cityDescription, setCityDescription] = useState("");
  const navigate = useNavigate();

  const handleFeatureChange = (index, value) => {
    const updated = [...hotel.features];
    updated[index] = value;
    setHotel({ ...hotel, features: updated });
  };

  const addFeature = () => {
    if (hotel.features.length < 7) {
      setHotel({ ...hotel, features: [...hotel.features, ""] });
    }
  };

  const fetchInterestingFacts = async () => {
    if (!hotel.city) return alert("Please enter a city name first.");
    setLoadingFacts(true);

    try {
      const res = await axios.post("http://localhost:5000/api/generate-text", {
        city: hotel.city,
      });

      const { description, facts } = res.data;
      setCityDescription(description);
      setInterestingFacts(facts);
    } catch (err) {
      console.error("Backend Error:", err);
      alert("Failed to fetch city facts.");
    } finally {
      setLoadingFacts(false);
    }
  };

  const handleSubmit = async () => {
    axios
      .post("http://localhost:5000/api/addhotel", {
        city: hotel.city,
        city_description: cityDescription,
        cool_features: interestingFacts,
        hotel_name: hotel.name,
        hotel_description: hotel.description,
        hotel_features: hotel.features,
        hotel_price: hotel.price,
        hotel_rating: hotel.rating,
      })
      .then((response) => {
        alert("Data recorded successfully!");
        console.log("Data saved successfully:", response.data);
        navigate("/home");
      })
      .catch((error) => {
        alert("Sorry, an error occurred.");
        console.error("Error saving hotel data:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-gray-100 p-6 md:p-10 font-sans">
      <motion.div
        className="max-w-4xl mx-auto bg-black bg-opacity-70 border border-yellow-600 rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">Hotel Information Form</h2>

        {/* Hotel Name */}
        <input
          type="text"
          placeholder="Hotel Name"
          value={hotel.name}
          onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-yellow-500"
        />

        {/* City */}
        <input
          type="text"
          placeholder="City"
          value={hotel.city}
          onChange={(e) => setHotel({ ...hotel, city: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-yellow-500"
        />

        {/* Description */}
        <textarea
          placeholder="Hotel Description"
          rows={4}
          value={hotel.description}
          onChange={(e) => setHotel({ ...hotel, description: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-yellow-500"
        />

        {/* Features */}
        <h4 className="text-lg text-yellow-300 font-semibold mb-2">Features (up to 7):</h4>
        {hotel.features.map((feature, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Feature ${idx + 1}`}
            value={feature}
            onChange={(e) => handleFeatureChange(idx, e.target.value)}
            className="w-full mb-2 p-2 rounded bg-gray-800 text-white border border-yellow-500"
          />
        ))}
        {hotel.features.length < 7 && (
          <button
            onClick={addFeature}
            className="mt-2 text-yellow-400 hover:text-yellow-300"
          >
            + Add Feature
          </button>
        )}

        {/* Rating Slider */}
        <div className="mt-6">
          <label className="block text-yellow-300 mb-2 font-medium">Hotel Rating: {hotel.rating} ⭐</label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={hotel.rating}
            onChange={(e) => setHotel({ ...hotel, rating: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Price Slider */}
        <div className="mt-6">
          <label className="block text-yellow-300 mb-2 font-medium">
            Price: ₹{hotel.price}
          </label>
          <input
            type="range"
            min="500"
            max="100000"
            step="100"
            value={hotel.price}
            onChange={(e) => setHotel({ ...hotel, price: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Interesting Facts */}
        <div className="mt-6">
          <button
            onClick={fetchInterestingFacts}
            className="bg-yellow-500 text-black font-bold px-5 py-2 rounded hover:bg-yellow-400 transition"
          >
            Get 4 Interesting Facts About {hotel.city || "City"}
          </button>

          {loadingFacts && <p className="mt-4 text-yellow-300">Loading facts...</p>}

          {interestingFacts.length > 0 && (
            <div className="mt-4 bg-gray-900 p-4 rounded-lg border border-yellow-600">
              <h4 className="text-yellow-400 text-xl font-bold mb-3">Interesting Facts:</h4>
              <ul className="list-decimal pl-6 space-y-1">
                {interestingFacts.map((fact, idx) => (
                  <li key={idx} className="text-white">
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-400 transition"
        >
          Submit Hotel Info
        </button>
      </div>
    </div>
  );
};

export default HotelInfoForm;
