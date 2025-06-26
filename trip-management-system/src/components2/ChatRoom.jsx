import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';
import SidePanel from './Sidepanel';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, push, onValue, serverTimestamp } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../components/FirebaseConfig'; // Adjust path if needed

const TeamChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('Guest');
    const chatContainerRef = useRef(null);

    // Firebase setup
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const database = getDatabase(app);
    const chatRef = ref(database, 'teamChat'); // Reference to your chat data

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsername(user.displayName || user.email || 'Guest');
            } else {
                setUsername('Guest');
            }
        });
        return () => unsubscribeAuth();
    }, [auth]);

    useEffect(() => {
        // Listen for new messages from Firebase
        const unsubscribeChat = onValue(chatRef, (snapshot) => {
            const messagesData = snapshot.val();
            if (messagesData) {
                const messageList = Object.values(messagesData);
                setMessages(messageList);
                // Scroll to the bottom on new messages
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribeChat(); // Unsubscribe when component unmounts
    }, []); // Empty dependency array means this runs once after the initial render

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        push(chatRef, {
            sender: username,
            text: newMessage,
            timestamp: serverTimestamp(),
        });

        setNewMessage('');
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="bg-[#121212] border border-gray-700 rounded-3xl shadow-2xl flex flex-col flex-grow max-w-3xl w-full mx-auto"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-[#1e1e1e] text-xl font-bold text-center py-4 rounded-t-3xl border-b border-gray-700">
                    💬 Team Chat
                </div>

                <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#181818]">
                    {messages.sort((a, b) => a.timestamp - b.timestamp).map((msg) => (
                        <motion.div
                            key={msg.timestamp} // Use timestamp as key for Firebase data
                            className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div
                                className={`rounded-2xl px-4 py-2 max-w-xs shadow-md text-sm ${
                                    msg.sender === username ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
                                }`}
                            >
                                <div className="text-xs text-gray-300 mb-1 flex items-center gap-2">
                                    <FaUserCircle /> {msg.sender}
                                </div>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="border-t border-gray-700 p-4 flex items-center gap-3 bg-[#1e1e1e] rounded-b-3xl">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-grow bg-[#2a2a2a] text-white p-3 rounded-2xl focus:outline-none border border-gray-600"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-md transition"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </motion.div>

            <SidePanel />

        </motion.div>
    );
};

export default TeamChatPage;