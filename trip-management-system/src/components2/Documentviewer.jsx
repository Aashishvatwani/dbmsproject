import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { FaFileAlt, FaUserShield } from 'react-icons/fa';
import SidePanel from './Sidepanel';
import { get, ref } from 'firebase/database';
import { initializeApp } from 'firebase/app'; // adjust paths as needed
import firebaseConfig from '../components/FirebaseConfig'; // adjust path as needed
import { getAuth } from 'firebase/auth'; // adjust path as needed
import { getDatabase } from 'firebase/database'; // adjust path as needed
import NotificationBadge from './NotificationBadge';

const ViewTeammateDocuments = () => {
  const [message, setMessage] = useState('');
  const [canView, setCanView] = useState(false);
  const [teamDocs, setTeamDocs] = useState([]);
const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);
  const handlePermission = async () => {
    if (!message.trim()) {
      toast.error('Please leave a message before accessing documents.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      const teamsSnapshot = await get(ref(db, 'teams'));
      let userTeamName = null;

      teamsSnapshot.forEach((teamSnap) => {
        const teamData = teamSnap.val();
        if (teamData.members && Array.isArray(teamData.members)) {
          const isMember = teamData.members.some(member => member.email === user.email);
          if (isMember) {
            userTeamName = teamData.teamName;
          }
        }
      });

      if (!userTeamName) {
        toast.error("Your team could not be identified.");
        return;
      }

      const docsSnapshot = await get(ref(db, `documents/${userTeamName}`));
      const docsData = docsSnapshot.val();

      if (!docsData) {
        toast.error("No documents found in your team.");
        return;
      }

      const filteredDocs = [];

      Object.entries(docsData).forEach(([uid, docEntry]) => {
        if (docEntry.visibility === 'team' && docEntry.documents) {
          Object.entries(docEntry.documents).forEach(([docName, ipfsHash]) => {
            filteredDocs.push({
              uploader: docEntry.name,
              name: docName,
              hash: ipfsHash,
            });
          });
        }
      });

      if (filteredDocs.length === 0) {
        toast('No documents with "team" visibility.');
        return;
      }

      setTeamDocs(filteredDocs);
      setCanView(true);
      toast.success('Access granted. Documents loaded.');
    } catch (error) {
      console.error("Error fetching teammate documents:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Toaster position="top-center" />
      <motion.div
        className="bg-[#121212] p-10 rounded-3xl w-full max-w-3xl shadow-lg border border-gray-800"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <FaUserShield className="text-yellow-400" /> View Teammate Documents
        </h2>

        <p className="text-gray-400 text-sm mb-6 text-center">
          Please leave a short message explaining why you want to access your teammate's documents.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-24 p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white mb-4"
          placeholder="Leave a message..."
        />

        <motion.button
          onClick={handlePermission}
          className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition mb-6"
          whileHover={{ scale: 1.05 }}
        >
          Request Access
        </motion.button>

        {canView && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-2">📄 Team Documents</h3>
            {teamDocs.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-[#1f1f1f] border border-gray-700"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <FaFileAlt className="text-blue-400" />
                    <span className="font-semibold">{doc.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">Uploaded by: {doc.uploader}</span>
                </div>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${doc.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300 underline hover:text-blue-200"
                >
                  View File
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
      <SidePanel />
    </motion.div>
  );
};

export default ViewTeammateDocuments;
