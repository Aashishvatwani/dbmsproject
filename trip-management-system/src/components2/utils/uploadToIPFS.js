import axios from "axios";

// Pinata API credentials (replace with your actual credentials)
const pinataApiKey = "2b6f0c14f376fb047541";
const pinataSecretApiKey = "4cec31fb453a90e5e93e59f22e7ec0842db258f92b0275f5a7d578924fa3fe14";

// Function to upload file to IPFS
const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });

    return response.data.IpfsHash; // Returns the IPFS hash
  } catch (error) {
    console.error("Error uploading file to IPFS", error);
    throw new Error("Error uploading file to IPFS");
  }
};

export default uploadToIPFS;
