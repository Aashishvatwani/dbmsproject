import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaIdCard, FaAddressCard, FaUserCircle, FaTicketAlt, FaUsers } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import SidePanel from './Sidepanel';
import NotificationBadge from './NotificationBadge';
import { storeToBlockchain } from './utils/storeToBlockchain'; // Import your storeToBlockchain function
import uploadToIPFS from './utils/uploadToIPFS'; // Import the uploadToIPFS function
import CityQuestionPopup from './Aichatpod'; // Import the CityQuestionPopup component
import { ref, set, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../components/FirebaseConfig'; // Import your Firebase config
import { getDatabase } from 'firebase/database'; // adjust path as needed

const DocumentUploadPage = () => {
  const [documents, setDocuments] = useState({});
  const [permission, setPermission] = useState(false);
  const app= initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);
  const handleFileChange = (e, field) => {
    setDocuments({ ...documents, [field]: e.target.files[0] });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!documents['PAN Card'] || !documents['Aadhar Card'] || !documents['User Photo'] || !documents['Tickets']) {
    toast.error("Please upload all required documents!");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    toast.error("User not authenticated");
    return;
  }

  try {
    const ipfsHashes = await Promise.all(
      Object.keys(documents).map(async (field) => {
        const file = documents[field];
        const ipfsHash = await uploadToIPFS(file);
        return { field, ipfsHash };
      })
    );

    for (let { field, ipfsHash } of ipfsHashes) {
      await storeToBlockchain(field, ipfsHash);
    }

    // Fetch all teams
    const teamsSnapshot = await get(ref(db, 'teams'));
    let teamName = null;

    teamsSnapshot.forEach((teamSnap) => {
      const teamData = teamSnap.val();

      if (teamData.members && Array.isArray(teamData.members)) {
        // Check if user's email is in members array
        const isMember = teamData.members.some(member => member.email === user.email);
        if (isMember) {
          teamName = teamData.teamName;
        }
      }
    });

    if (!teamName) {
      toast.error("Your team could not be found.");
      return;
    }

    const docData = {
      name: user.displayName || user.email,
      visibility: permission ? 'team' : 'private',
      documents: {},
    };

    ipfsHashes.forEach(({ field, ipfsHash }) => {
      docData.documents[field] = ipfsHash;
    });

    await set(ref(db, `documents/${teamName}/${user.uid}`), docData);

    toast.success("Documents stored in Firebase with IPFS links!");
  } catch (error) {
    console.error("Document upload error:", error);
    toast.error("Upload failed!");
  }
};

  const docFields = [
    { name: 'PAN Card', icon: <FaIdCard className="text-blue-400 mr-2" /> },
    { name: 'Aadhar Card', icon: <FaAddressCard className="text-green-400 mr-2" /> },
    { name: 'User Photo', icon: <FaUserCircle className="text-yellow-400 mr-2" /> },
    { name: 'Tickets', icon: <FaTicketAlt className="text-purple-400 mr-2" /> },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        className="bg-[#121212] p-10 rounded-3xl w-full max-w-3xl shadow-lg border border-gray-800"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">📁 Upload Your Travel Documents</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {docFields.map((doc, i) => (
            <div key={i}>
              <label className="block mb-2 text-gray-300 flex items-center">
                {doc.icon} Upload {doc.name}
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, doc.name)}
                className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-600 text-white"
                required
              />
            </div>
          ))}

          <div className="flex items-center space-x-4 mt-4">
            <input
              type="checkbox"
              id="permission"
              checked={permission}
              onChange={(e) => setPermission(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="permission" className="text-gray-300 flex items-center">
              <FaUsers className="text-blue-300 mr-2" /> Allow teammates to view my uploaded documents
            </label>
          </div>

          <motion.button
            type="submit"
            className="w-full mt-6 bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-300 transition"
            whileHover={{ scale: 1.05 }}
          >
            Upload Documents
          </motion.button>
        </form>
      </motion.div>
      <SidePanel />
      <NotificationBadge />
<CityQuestionPopup /> {/* Include the CityQuestionPopup component here */}
    </motion.div>
  );
};

export default DocumentUploadPage;
