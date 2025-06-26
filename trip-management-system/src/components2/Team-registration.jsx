import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SidePanel from './Sidepanel';
import NotificationBadge from './NotificationBadge';
import { useNavigate, useParams } from 'react-router-dom';
import emailjs from 'emailjs-com'; 
import { getDatabase, ref, push, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../components/FirebaseConfig';

const TeamRegistration = () => {
  const navigate = useNavigate();
  const { members } = useParams();
  const [teamData, setTeamData] = useState([]);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    const dummyMembers = parseInt(members, 10) || 3; // Fallback to 3 members
    setTeamData(Array.from({ length: dummyMembers }, () => ({ name: '', email: '', phone: '' })));
  }, [members]);

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const handleChange = (index, field, value) => {
    const updated = [...teamData];
    updated[index][field] = value;
    setTeamData(updated);
  };

  const handleSendEmail = () => {
    const emailParams = {
      email: teamData[0].email,
      to_name: teamData[0].name,
      confirmation_link: `http://localhost:80/confirmation-page/${encodeURIComponent(teamName)}`,
    };
  
    emailjs
      .send("service_8mh0s85", "template_luzt18g", emailParams, "8vsQbt7veWtuGoV4f")
      .then((response) => {
        console.log('Email sent successfully:', response);
        alert("Email sent successfully!");
      })
      .catch((err) => {
        console.error("Error sending email:", err);
        alert(`Failed to send email. Error: ${err.message || err}`);
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const teamRef = push(ref(database, 'teams'));
      const teamId = teamRef.key;
  
      await set(teamRef, {
        teamName,
        members: teamData,
        createdAt: new Date().toISOString(),
      });
  
      await handleSendEmail();
  
      navigate(`/confirmation-page/${encodeURIComponent(teamName)}`);
    } catch (error) {
      console.error('Submission error:', error);
      alert('❌ Something went wrong while submitting the team.');
    }
  };
  
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6 text-white"
    >
      <div className="bg-[#121212] shadow-2xl rounded-3xl p-10 max-w-3xl w-full border border-gray-800">
        <h1 className="text-4xl font-bold mb-8 text-center">🧑‍🤝‍🧑 Team Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
        <input
  type="text"
  placeholder="Team Name"
  value={teamName}
  onChange={(e) => setTeamName(e.target.value)}
  required
  className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white mb-6"
/>

          {teamData.map((member, index) => (
            <div key={index} className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Member {index + 1}</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={member.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={member.email}
                  onChange={(e) => handleChange(index, 'email', e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={member.phone}
                  onChange={(e) => handleChange(index, 'phone', e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full mt-6 bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Register Team
          </button>
        </form>
      </div>
      <SidePanel />
    </motion.div>
  );
};

export default TeamRegistration;
