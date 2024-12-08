import { ethers } from "ethers";
import CONTRACT_ADDRESS from "./auction-contract-address.json";
import CONTRACT_ABI from "./Auction.json";

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

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
            return true
        } else {
            console.log("Transaction failed.");
            return false
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


const isUserRegistered = async (contract, userAddress) => {
    try {
        const isRegistered = await contract.registeredUsers(userAddress);
        console.log(`Is user registered (${userAddress}):`, isRegistered);
        return isRegistered;
    } catch (error) {
        console.error("Error checking user registration:", error);
        return false;
    }
};


const createAuction = async (contract, title, startingPrice, reservePrice, startDate, endDate) => {
    try {
        const description = title; // Description of the auction item
        const startedPrice = ethers.utils.parseEther(startingPrice); // Starting price in Ether (e.g., 0.1 ETH)
        const reservedPrice = ethers.utils.parseEther(reservePrice); // Reserve price in Ether (e.g., 0.5 ETH)
        
        const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
        const durationInSeconds = endTimestamp - startTimestamp;
        const duration = durationInSeconds; // Duration in seconds (1 day)
        console.log("Duration:", duration);

        // Call the createAuction function
        const tx = await contract.createAuction(description, startedPrice, reservedPrice, duration);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        const event = receipt.events.find(e => e.event === "AuctionCreated");

        if (event) {
            const auctionId = event.args.auctionId; // Get the emitted _auctionId
            console.log("Auction created with ID:", auctionId);
            console.log("Auction created successfully:", receipt);
            // Save to MySQL via API call
            return auctionId;
        }
        
    } catch (error) {
        console.error("Error creating auction:", error);
    }
};

const listenForAuctionCreated = async (contract, callback) => {
    contract.on("AuctionCreated", (auctionId, address, title) => {
        callback(auctionId, address, title);
    });
};

const placeBid = async (contract, auctionId, bidAmount) => {
    try {
        console.log("Placing bid on auction:", auctionId, "with amount:", bidAmount);
        const tx = await contract.placeBid(auctionId, {
            value: ethers.utils.parseEther(bidAmount.toString()), 
          });

        const receipt = await tx.wait();
        console.log("Bid placed successfully:", receipt);
    } catch (error) {
        console.error("Error placing bid:", error);
        alert(error.message);
    }
}

const listenForBidPlaced = async (contract) => {
    contract.on("BidPlaced", (auctionId, address, value) => {
        console.log("BidPlaced: ", auctionId, address, value);
    });
};


const getAuctionHighest = async (contract, auctionId) => { 
    console.log("Getting auction details for ID:", auctionId);
    try {
        const auction = await contract.getAuction(auctionId);
        console.log("Auction details:", auction);
        const highest = ethers.utils.formatEther(auction.highestBid);
        return highest;
    } catch (error) {
        console.error("Error getting auction details:", error);
    }
};


const getBidHistory = async (contract, auctionId) => {
    try {
        const [bidders, amounts, timestamps] = await contract.getBidHistory(auctionId);
        console.log(`Bidders: Bid history for (${auctionId}):`, bidders);
        console.log(`Amounts: Bid history for (${auctionId}):`, amounts);
        console.log(`Timestamps: Bid history for (${auctionId}):`, timestamps);

        let history = [];
        const length = bidders.length;
        for (let i = 0; i < length; i++) {
            const bidderV = bidders[i];
            const amountV = ethers.utils.formatEther(amounts[i]);
            const timestampV = formatDate(new Date(timestamps[i].toNumber() * 1000));
            history.push({bidderV, amountV, timestampV});
        }
        return history;
    } catch (error) {
        console.error("Error checking user registration:", error);
        return [];
    }
};

const getBidCount = async (contract, auctionId) => {
    try {
        const bidCount = await contract.getBidCount(auctionId);
        console.log(`Bid count for (${auctionId}):`, bidCount);
        const bigNumber = ethers.BigNumber.from(bidCount);
        const intValue = bigNumber.toNumber();
        return intValue;
    } catch (error) {
        console.error("Error checking user registration:", error);
        return [];
    }
};

 // End Auction
//  function endAuction(uint256 _auctionId) external 
//  auctionExists(_auctionId) 
// {
//  AuctionItem storage auction = auctions[_auctionId];
//  require(!auction.ended, "Auction already ended");
//  require(block.timestamp >= auction.endTime || msg.sender == auction.seller, 
//          "Auction still active");

//  auction.ended = true;
//  auction.active = false;

//  if (auction.highestBid >= auction.reservePrice) {
//      // Transfer funds to seller
//      payable(auction.seller).transfer(auction.highestBid);
//      emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
//  } else {
//      // Refund highest bidder if reserve price not met
//      if (auction.highestBidder != address(0)) {
//          payable(auction.highestBidder).transfer(auction.highestBid);
//          emit RefundProcessed(auction.highestBidder, auction.highestBid);
//      }
//  }
// }

const endAuction = async (contract, auctionId) => {
    try {
        console.log("Ending auction:", auctionId);
        const tx = await contract.endAuction(auctionId);
        const receipt = await tx.wait();
        console.log("Auction ended successfully:", receipt);
    } catch (error) {
        console.error("Error ending auction:", error);
    }
};

export {connectWallet, connection, registerUser, listenForUserRegistration, isUserRegistered, 
    createAuction, listenForAuctionCreated, placeBid, listenForBidPlaced, getAuctionHighest, 
    getBidHistory, getBidCount, endAuction};