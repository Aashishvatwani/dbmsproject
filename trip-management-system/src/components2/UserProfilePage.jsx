import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaUser, FaEnvelope, FaMoneyBillWave, FaChartBar,
    FaArrowUp, FaArrowDown, FaSmile, FaExclamationTriangle
} from 'react-icons/fa';
import axios from 'axios';
import SidePanel from './Sidepanel'; // Assuming these are in the same directory
import CityQuestionPopup from './Aichatpod';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../components/FirebaseConfig';
Chart.register(...registerables);

const UserProfilePage = () => {
    const [paymentsData, setPaymentsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [username, setUsername] = useState("Guest");
    const [useremail, setUseremail] = useState("");
    const [debts, setDebts] = useState([]);
    const [credits, setCredits] = useState([]);
    const [expenseHistory, setExpenseHistory] = useState([]);
    const [notification, setNotification] = useState(null);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUsername(user.displayName || "Guest");
                setUseremail(user.email || "");
            } else {
                setUsername("Guest");
                setUseremail("");
            }
        });
        return () => unsubscribe();
    }, [auth]);

    const fetchPayments = async () => {
        setLoading(true);
        setFetchError(null);
        try {
            console.log('Fetching payments for email:', useremail); // Add this
            const res = await axios.post('http://localhost:5000/api/expense_see', {
                email: useremail,
                name: username
            });
            console.log('Response from /api/expense_see:', res.data); // And this
            setPaymentsData(res.data);
            setExpenseHistory(res.data.expenseHistory || []);
        } catch (err) {
            console.error('Failed to fetch payment data:', err);
            setFetchError('Failed to load trip data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (useremail) fetchPayments();
    }, [useremail, username]);

    useEffect(() => {
        if (paymentsData?.settlements && useremail) {
            const normalizedEmail = useremail.toLowerCase().trim();
            const userDebts = paymentsData.settlements.filter(
                s => s.from.toLowerCase().trim() === normalizedEmail && !s.paid
            );
            const userCredits = paymentsData.settlements.filter(
                s => s.to.toLowerCase().trim() === normalizedEmail && !s.paid
            );
            setDebts(userDebts);
            setCredits(userCredits);
        } else {
            setDebts([]);
            setCredits([]);
        }
    }, [paymentsData, useremail]);

    const handleMarkAsPaid = async (debt) => {
        try {
            const response = await axios.post('http://localhost:5000/api/expense_see/mark-paid', {
                from: debt.from,
                to: debt.to,
                amount: debt.amount
            });

            if (response.status === 200) {
                setNotification({ type: 'success', message: '✅ Payment marked as completed!' });
                await fetchPayments(); // refresh data
                setTimeout(() => setNotification(null), 3000);
            } else {
                setNotification({ type: 'error', message: '⚠️ Failed to update payment.' });
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (err) {
            console.error('Error marking payment as paid:', err);
            setNotification({ type: 'error', message: '❌ Something went wrong while marking payment.' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const isBudgetPositive = () => {
        const totalOwed = debts.reduce((acc, d) => acc + parseFloat(d.amount || 0), 0);
        return totalOwed <= 15000;
    };

    const allDates = [...new Set(expenseHistory.map(e => e.date))].sort();
    const allStudents = [...new Set(expenseHistory.map(e => e.student_name))];

    console.log("Expense History:", expenseHistory);  //  crucial
    console.log("All Dates:", allDates);             //  crucial
    console.log("All Students:", allStudents);         //  crucial

    const chartData = {
        labels: allDates,
        datasets: allStudents.map((student, index) => {
            const color = `hsl(${index * 60}, 70%, 50%)`;
            const studentData = allDates.map(date => {
                const entry = expenseHistory.find(
                    e => e.student_name === student && e.date === date
                );
                const amount = entry ? parseFloat(entry.amount) : 0;
                return amount;
            });
            return {
                label: student,
                data: studentData,
                backgroundColor: color,
            };
        }),
    };

    console.log("Chart Data:", chartData); // VERY IMPORTANT: Check this!

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Expense History by Student',
                color: 'white',
            },
            legend: {
                labels: {
                    color: 'white',
                },
            },
        },
        scales: {
            x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            y: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
        },
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl">
                Loading your trip profile...
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl">
                ⚠️ {fetchError}
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            {notification && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
                        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                >
                    {notification.message}
                </div>
            )}
            <motion.div
                className="bg-[#121212] p-10 rounded-3xl w-full max-w-4xl shadow-lg border border-gray-800 mb-8"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-8 text-center">🧑‍🚀 Your Trip Profile</h2>

                <div className="space-y-4 text-gray-300">
                    <div className="flex items-center gap-3">
                        <FaUser className="text-blue-400" /> <span className="font-semibold">Username:</span> {username}
                    </div>
                    <div className="flex items-center gap-3">
                        <FaEnvelope className="text-green-400" /> <span className="font-semibold">Email:</span> {useremail}
                    </div>
                    <div className="flex items-center gap-3">
                        <FaMoneyBillWave className="text-yellow-400" />
                        <span className="font-semibold">Total Group Spent:</span> ₹{paymentsData?.totalExpenditure}
                    </div>
                    <div className="flex items-center gap-3">
                        <FaChartBar className="text-pink-500" />
                        <span className="font-semibold">Per Person Share:</span> ₹{paymentsData?.perPersonShare}
                    </div>
                </div>

                {/* Debts & Credits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <FaArrowDown className="text-red-400" /> Amount You Owe
                        </h4>
                        {debts.length > 0 ? debts.map((d, i) => (
                            <div key={i} className="mb-3 flex justify-between items-center bg-gray-800 p-2 rounded-md">
                                <span>💸 To {d.to}: ₹{d.amount}</span>
                                <button
                                    onClick={() => handleMarkAsPaid(d)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Mark as Paid
                                </button>
                            </div>
                        )) : (
                            <p className="text-gray-400">No debts</p>
                        )}
                    </div>

                    <div className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700">
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <FaArrowUp className="text-green-400" /> Amount You Will Receive
                        </h4>
                        {credits.length > 0 ? credits.map((c, i) => (
                            <div key={i} className="flex justify-between items-center mb-2">
                                <p>🤑 From {c.from}: ₹{c.amount}</p>
                            </div>
                        )) : (
                            <p className="text-gray-400">No credits</p>
                        )}
                    </div>
                </div>

                {/* Graph Section */}
                <motion.div
                    className="bg-[#1e1e1e] p-6 mt-10 rounded-xl w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h3 className="text-xl font-semibold text-center mb-4">📊 Group Expense Distribution</h3>
                    {expenseHistory.length > 0 ? (
                        <div className="h-[400px] w-full">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-center text-gray-400">No expense data to display.</p>
                    )}
                </motion.div>

                {/* Budget Notification */}
                <div className="mt-10 text-center">
                    {isBudgetPositive() ? (
                        <div className="text-green-400 font-semibold text-xl flex flex-col items-center">
                            <FaSmile className="text-3xl mb-2" />
                            Great job! You've spent wisely and kept under your budget! 🎉
                        </div>
                    ) : (
                        <div className="text-yellow-400 font-semibold text-xl flex flex-col items-center">
                            <FaExclamationTriangle className="text-3xl mb-2" />
                            Oops! You overspent your budget. Try saving more next time 🥺💸
                        </div>
                    )}
                </div>
            </motion.div>

            <SidePanel />
            <CityQuestionPopup />
        </motion.div>
    );
};

export default UserProfilePage;

