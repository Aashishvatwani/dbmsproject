import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import emailjs from "emailjs-com";

const TravelDetails = () => {
  const [travelData, setTravelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinalDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/finals");
        const data = response.data[0];

        const fromDate = new Date(data.from_date);
        const toDate = new Date(data.to_date);
        const diffTime = Math.abs(toDate - fromDate);
        const numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let travelRange = { min: 0, max: 0 };
        switch (data.mediam.toLowerCase()) {
          case "bus":
            travelRange = { min: 300, max: 1500 };
            break;
          case "plane":
            travelRange = { min: 2500, max: 10000 };
            break;
          case "train":
            travelRange = { min: 350, max: 7000 };
            break;
          default:
            travelRange = { min: 0, max: 0 };
        }

        setTravelData({
          hotelName: data.restaurant || "Hotel",
          fromCity: data.from_city,
          toCity: data.package_city,
          fromDate: data.from_date,
          toDate: data.to_date,
          hotelBudget: data.hotel_price || 0,
          useremail: data.useremail,
          username: data.username,
          otherExpensesBudget: 1500 * numDays,
          travelBudgetMin: travelRange.min,
          travelBudgetMax: travelRange.max,
          numDays,
        });
      } catch (error) {
        alert("Failed to fetch final booking details.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinalDetails();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const handleSendEmail = () => {
    const emailParams = {
      from_name: "Travel App",
      to_name: travelData.username , // Replace with actual user name or use state if you collect it
      to_email:travelData.useremail ,
      hotel_name: travelData.hotelName,
      from_city: travelData.fromCity,
      to_city: travelData.toCity,
      from_date: new Date(travelData.fromDate).toLocaleDateString(),
      to_date: new Date(travelData.toDate).toLocaleDateString(),
      hotel_budget: travelData.hotelBudget,
      other_expenses: travelData.otherExpensesBudget,
      travel_budget_min: travelData.travelBudgetMin,
      travel_budget_max: travelData.travelBudgetMax,
      total_budget_min: Math.floor(
        Number(travelData.hotelBudget) +
          Number(travelData.otherExpensesBudget) +
          Number(travelData.travelBudgetMin)
      ),
      total_budget_max: Math.floor(
        Number(travelData.hotelBudget) +
          Number(travelData.otherExpensesBudget) +
          Number(travelData.travelBudgetMax)
      ),
    };

    emailjs
      .send("service_8mh0s85", "template_id22y8k", emailParams, "8vsQbt7veWtuGoV4f")
      .then((response) => {
        alert("Email sent successfully!");
      })
      .catch((err) => {
        console.error("Error sending email:", err);
        alert("Failed to send email.");
      });
  };

  if (loading || !travelData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-xl">
        Loading travel details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-gray-100 font-sans antialiased px-4 py-8">
      <motion.div
        id="travel-details"
        className="max-w-4xl mx-auto p-6 md:p-10 rounded-xl shadow-2xl bg-black bg-opacity-70 backdrop-filter backdrop-blur-md border border-yellow-600"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
              {travelData.hotelName}
            </h2>
            <p className="text-base md:text-lg mt-1">From: {travelData.fromCity}</p>
            <p className="text-base md:text-lg">To: {travelData.toCity}</p>
          </div>

          <div className="md:text-right">
            <p className="text-base md:text-lg font-semibold">Dates:</p>
            <p className="text-sm md:text-base">
              From: {new Date(travelData.fromDate).toLocaleDateString()}
            </p>
            <p className="text-sm md:text-base">
              To: {new Date(travelData.toDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Budget Breakdown Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg"
            variants={cardVariants}
          >
            <h3 className="text-lg md:text-xl font-semibold text-yellow-300 mb-2 md:mb-3">
              Hotel Budget
            </h3>
            <p className="text-base md:text-lg">₹{travelData.hotelBudget}</p>
          </motion.div>

          <motion.div
            className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg"
            variants={cardVariants}
          >
            <h3 className="text-lg md:text-xl font-semibold text-yellow-300 mb-2 md:mb-3">
              Other Expenses
            </h3>
            <p className="text-base md:text-lg">₹{travelData.otherExpensesBudget}</p>
          </motion.div>

          <motion.div
            className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg col-span-1"
            variants={cardVariants}
          >
            <h3 className="text-lg md:text-xl font-semibold text-yellow-300 mb-2 md:mb-3">
              Travel Budget
            </h3>
            <p className="text-base md:text-lg">
              ₹{travelData.travelBudgetMin} - ₹{travelData.travelBudgetMax}
            </p>
          </motion.div>
        </div>

        {/* Total Budget */}
        <motion.div
          className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg mt-6 md:mt-8 text-center"
          variants={cardVariants}
        >
          <h3 className="text-xl md:text-2xl font-bold text-yellow-300 mb-2 md:mb-3">
            Total Travel Budget
          </h3>
          <p className="text-2xl md:text-4xl font-semibold text-yellow-500">
            ₹
            {Math.floor(
              Number(travelData.hotelBudget) +
                Number(travelData.otherExpensesBudget) +
                Number(travelData.travelBudgetMin)
            )}{" "}
            - ₹
            {Math.floor(
              Number(travelData.hotelBudget) +
                Number(travelData.otherExpensesBudget) +
                Number(travelData.travelBudgetMax)
            )}
          </p>
          <p className="text-sm md:text-base mt-2 text-gray-400">
            Estimated budget range including transport variability.
          </p>
        </motion.div>

        {/* Send Email Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleSendEmail}
            className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg hover:bg-yellow-400 transition duration-300"
          >
            Send Budget Details via Email
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TravelDetails;
