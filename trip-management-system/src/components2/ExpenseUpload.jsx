import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPiggyBank, FaCrown } from 'react-icons/fa';
import CityQuestionPopup from './Aichatpod';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import SidePanel from './Sidepanel';
import NotificationBadge from './NotificationBadge';

const COLORS = ['#00BFFF', '#FF69B4', '#32CD32', '#FFD700', '#FF4500'];

const ExpenseUpload = () => {
  const [showChart, setShowChart] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    purpose: '',
    location: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/expenseshower")
      .then((res) => {
        const fetchedData = res.data.map(item => ({
          name: item.student_name,
          amount: parseFloat(item.amount), // force number
          purpose: item.for_what,
          location: item.location || 'Unknown'
        }));
        setExpenses(fetchedData);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      name: form.name,
      amount: parseFloat(form.amount),
      purpose: form.purpose,
      location: form.location
    };

    const updated = [...expenses, newExpense];
    setExpenses(updated);

    toast.success(`Expense added for ${form.name}`, {
      style: { background: '#333', color: '#fff' },
    });

    setForm({ name: '', amount: '', purpose: '', location: '' });

    axios
      .post("http://localhost:5000/api/expense", {
        name: form.name,
        for_what: form.purpose,
        amount: parseFloat(form.amount),
        location: form.location // included now
      })
      .then((response) => {
        alert("Data recorded successfully!");
        console.log("Data saved successfully:", response.data);
      })
      .catch((error) => {
        alert("Sorry, an error occurred.");
        console.error("Error saving expense data:", error);
      });
  };

  const spendingData = expenses.map(exp => ({
    name: exp.name,
    value: Number(exp.amount || 0)
  }));

  const topSpender = expenses.reduce((max, item) => item.amount > max.amount ? item : max, { amount: 0 });
  const lowestSpender = expenses.reduce((min, item) => item.amount < min.amount ? item : min, { amount: Infinity });

  const totalSpent = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6 text-white"
    >
      <Toaster />
      <div className="bg-[#121212] shadow-2xl rounded-3xl p-10 max-w-4xl w-full border border-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-center">💸 Upload Your Expense</h1>

        {(expenses.length > 0) && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-700">
              <FaCrown className="text-yellow-400 text-3xl mb-2 mx-auto" />
              <p className="text-xl font-semibold">{topSpender.name || '—'}</p>
              <p className="text-sm text-gray-400">Super Spender 🤑</p>
            </div>
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-700">
              <FaPiggyBank className="text-green-400 text-3xl mb-2 mx-auto" />
              <p className="text-xl font-semibold">{lowestSpender.name || '—'}</p>
              <p className="text-sm text-gray-400">Super Saver 🐷</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="Your Name"
            required
            className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
          />
          <input
            type="number"
            value={form.amount}
            onChange={e => handleChange('amount', e.target.value)}
            placeholder="Amount Spent (₹)"
            min="1"
            required
            className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
          />
          <input
            type="text"
            value={form.purpose}
            onChange={e => handleChange('purpose', e.target.value)}
            placeholder="Purpose (e.g., Lunch, Tickets)"
            required
            className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
          />
          <input
            type="text"
            value={form.location}
            onChange={e => handleChange('location', e.target.value)}
            placeholder="Location (e.g., Jaipur Mall)"
            required
            className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Add Expense
          </button>
        </form>

        <p className="text-lg text-center mt-6 text-gray-300">
          Total Spent: ₹{totalSpent}
        </p>

        {expenses.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">📋 Expense Summary</h3>
            <ul className="space-y-3">
              {expenses.map((item, i) => (
                <li key={i} className="bg-[#1c1c1c] p-4 rounded-xl border border-gray-700">
                  <p><span className="text-gray-400">Name:</span> {item.name}</p>
                  <p><span className="text-gray-400">Amount:</span> ₹{item.amount}</p>
                  <p><span className="text-gray-400">Purpose:</span> {item.purpose}</p>
                  <p><span className="text-gray-400">Location:</span> {item.location}</p>
                  <button
                    onClick={() => setExpenses(expenses.filter((_, index) => index !== i))}
                    className="text-red-400 text-sm mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <motion.button
          type="button"
          onClick={() => setShowChart(!showChart)}
          className="w-full mt-4 bg-[#1e1e1e] text-white py-3 rounded-full font-semibold border border-gray-600 hover:bg-gray-800 transition"
          whileHover={{ scale: 1.05 }}
        >
          {showChart ? 'Hide Graphical Data' : 'See Graphical Data'}
        </motion.button>

        {showChart && (
          <motion.div
            className="mt-10 p-6 rounded-xl bg-[#1c1c1c] border border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">📊 Expense Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={spendingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#2a2a2a', border: 'none', color: 'white' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      <SidePanel />
      <NotificationBadge />
      <CityQuestionPopup />
    </motion.div>
  );
};

export default ExpenseUpload;
