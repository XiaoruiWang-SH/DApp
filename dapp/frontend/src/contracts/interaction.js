import { ethers } from "ethers";
import CONTRACT_ADDRESS from "./auction-contract-address.json";
import CONTRACT_ABI from "./Auction.json";

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
    } catch (error) {
        console.error("Error connecting to wallet:", error);
    }
};

const connection = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS.Auction, CONTRACT_ABI.abi, signer);

        return contract;
    } catch (error) {
        console.error("Error during connection:", error);
        alert("connection failed. ");
    }
};

const registerUser = async (contract) => {
    try {
        const tx = await contract.registerUser();

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check the transaction status
        if (receipt.status === 1) {
            console.log("User registered successfully!");

            // Find the emitted event in the logs
            const event = receipt.events.find(event => event.event === "UserRegistered");
            console.log("Event details:", event.args);
        } else {
            console.log("Transaction failed.");
        }
    } catch (error) {
        console.error("Error registering user:", error);
    }
};

const listenForUserRegistration = async (contract) => {
    contract.on("UserRegistered", (user) => {
        console.log("User registered: ", user);
    });
};

export {connectWallet, connection, registerUser, listenForUserRegistration};