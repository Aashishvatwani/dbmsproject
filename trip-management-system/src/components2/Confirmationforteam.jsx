import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebaseConfig from '../components/FirebaseConfig';

const TeamConfirmationPage = () => {
  const { teamName } = useParams();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [allAvailable, setAllAvailable] = useState(false);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const teamsRef = ref(db, 'teams');

    onValue(teamsRef, (snapshot) => {
      const allTeams = snapshot.val();
      if (!allTeams) return;

      let matchedTeam = null;

      // Find the team with matching teamName
      Object.entries(allTeams).forEach(([key, team]) => {
        if (team.teamName === teamName) {
          matchedTeam = team;
        }
      });

      if (!matchedTeam) {
        alert('Team not found.');
        return;
      }

      const loginRef = ref(db, `logins/${teamName}`);
      onValue(loginRef, (loginSnapshot) => {
        const loginData = loginSnapshot.val() || {};

        const membersWithStatus = matchedTeam.members.map((member) => {
          const encodedEmail = member.email.replace(/\./g, '_');
          const isAvailable = loginData[encodedEmail] === true;

          return {
            name: member.name,
            status: isAvailable ? 'Pending' : 'Available',
          };
        });

        setTeamMembers(membersWithStatus);
        setAllAvailable(membersWithStatus.every((m) => m.status === 'Available'));
      });
    });
  }, [teamName]);

  const handleConfirm = () => {
    navigate('/expense-upload'); // Replace with your actual route
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-[#1a1a1a] rounded-3xl shadow-2xl p-10 max-w-xl w-full border border-gray-800 text-center"
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="flex items-center justify-center mb-6 space-x-3">
          <FaUsers className="text-blue-400 text-3xl" />
          <h2 className="text-3xl font-bold">Team: {decodeURIComponent(teamName)}</h2>
        </div>

        <p className="text-gray-400 mb-8">Is your team ready to go? Confirm below.</p>

        <div className="bg-[#2a2a2a] p-4 rounded-xl mb-8 shadow-inner">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
              <span>{member.name}</span>
              <span className={`flex items-center space-x-1 ${member.status === 'Available' ? 'text-green-400' : 'text-yellow-400'}`}>
                {member.status === 'Available' ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{member.status}</span>
              </span>
            </div>
          ))}
        </div>

        {allAvailable && (
          <motion.button
            onClick={handleConfirm}
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-full shadow-lg transition"
            whileHover={{ scale: 1.05 }}
          >
            ✅ Confirm Team Availability
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TeamConfirmationPage;
