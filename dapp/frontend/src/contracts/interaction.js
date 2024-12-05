import { ethers } from "ethers";
import CONTRACT_ADDRESS from "./contract-address.json";
import CONTRACT_ABI from "./Crowdfund.json";

const connectWallet = async () => {
    if (!window.ethereum) {
        alert("MetaMask is required!");
        return;
    }
    console.log("Connecting the wallet...");
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        console.log("Connected:", accounts);
        return accounts[0];
        // setCurrentAccount(accounts[0]);
    } catch (error) {
        console.error("Error connecting to wallet:", error);
    }
};

const register = async (username) => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS.Crowdfund, CONTRACT_ABI.abi, signer);

        const tx = await contract.register(username);
        await tx.wait();

        alert("Registration successful!");
    } catch (error) {
        console.error("Error during registration:", error);
        alert("Registration failed. Make sure you are not already registered.");
    }
};

export {connectWallet, register};