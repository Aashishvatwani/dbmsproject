import { ethers } from "ethers";
import DocumentStoreABI from "F:/personal_project1/blockchain/artifacts/contracts/Lock.sol/DocumentStore.json"; // use relative path

const contractAddress = "0xfB8313b3BB0c34647B65c28522ee5e266696b89D";

export const storeToBlockchain = async (filename, ipfsHash) => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask to interact with the blockchain.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      DocumentStoreABI.abi,
      signer
    );

    const tx = await contract.storeDocument(filename, ipfsHash);
    await tx.wait();

    alert("✅ Document stored successfully on the blockchain!");
  } catch (error) {
    console.error("❌ Error storing document:", error);
    alert("Failed to store document on blockchain.");
  }
};
