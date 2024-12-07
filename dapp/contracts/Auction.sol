// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    struct AuctionItem {
        uint256 id;
        address seller;
        string description;
        uint256 startingPrice;
        uint256 reservePrice;
        uint256 startTime;
        uint256 endTime;
        uint256 highestBid;
        address highestBidder;
        bool active;
        bool ended;
    } // Represents each auction with its details.

    // State variables
    mapping(uint256 => AuctionItem) public auctions; //Stores all auctions, mapped by their unique ID
    mapping(address => bool) public registeredUsers; //
    mapping(uint256 => mapping(address => uint256)) public bids;   // Records bids for each auction by bidder address.
    // bids[auctionId][Bob] = 2 ether
    uint256 public auctionCounter; // Counter to assign unique IDs to auctions.

    // Events
    event UserRegistered(address user);
    event AuctionCreated(uint256 auctionId, address seller, string description);
    event BidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);
    event RefundProcessed(address bidder, uint256 amount);

    //  events are an essential feature that allows smart contracts to communicate with external applications or the Ethereum network. 
    //  They act as a logging mechanism that stores data in the blockchain's transaction logs.
    
    // Modifiers
    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    modifier auctionExists(uint256 _auctionId) {
        require(_auctionId < auctionCounter, "Auction does not exist");
        _;
    }

    modifier auctionActive(uint256 _auctionId) {
        require(auctions[_auctionId].active, "Auction not active");
        require(block.timestamp >= auctions[_auctionId].startTime, "Auction not started"); // this may happen when there is a delay 
        require(block.timestamp <= auctions[_auctionId].endTime, "Auction ended");
        _;
    }

    // User Registration
    function registerUser() external {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    // Create Auction
    function createAuction(
        string memory _description,
        uint256 _startingPrice,
        uint256 _reservePrice,
        uint256 _duration
    ) external onlyRegistered {
        require(_duration > 0, "Duration must be positive");
        require(_startingPrice > 0, "Starting price must be positive");
        require(_reservePrice >= _startingPrice, "Reserve price must be >= starting price");

        uint256 auctionId = auctionCounter++;
        
        auctions[auctionId] = AuctionItem({
            id: auctionId,
            seller: msg.sender,
            description: _description,
            startingPrice: _startingPrice,
            reservePrice: _reservePrice,
            startTime: block.timestamp, // The timestamp when the auction is created. This is captured from block.timestamp (the current time in seconds 
                                        // since the Unix epoch) at the moment the createAuction function is called.
            endTime: block.timestamp + _duration,
            highestBid: 0,
            highestBidder: address(0),  // represents the zero address, a special Ethereum address 
                                        // that is effectively a placeholder for "no address" or "null."
            active: true,
            ended: false
        });

        emit AuctionCreated(auctionId, msg.sender, _description);
    }

    // Place Bid
    function placeBid(uint256 _auctionId) external payable  
        onlyRegistered 
        auctionExists(_auctionId) 
        auctionActive(_auctionId) 
    {   // the function is marked as payable, which means it can also receive Ether along with the transaction
        // which means it can receive id and bid money
        AuctionItem storage auction = auctions[_auctionId];
        require(msg.sender != auction.seller, "Seller cannot bid");
        require(msg.value > auction.highestBid, "Bid too low");
        require(msg.value >= auction.startingPrice, "Bid below starting price");

        // Refund the previous highest bidder
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        // Update auction state
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
        bids[_auctionId][msg.sender] = msg.value;

        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }

    // End Auction
    function endAuction(uint256 _auctionId) external 
        auctionExists(_auctionId) 
    {
        AuctionItem storage auction = auctions[_auctionId];
        require(!auction.ended, "Auction already ended");
        require(block.timestamp >= auction.endTime || msg.sender == auction.seller, 
                "Auction still active");

        auction.ended = true;
        auction.active = false;

        if (auction.highestBid >= auction.reservePrice) {
            // Transfer funds to seller
            payable(auction.seller).transfer(auction.highestBid);
            emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
        } else {
            // Refund highest bidder if reserve price not met
            if (auction.highestBidder != address(0)) {
                payable(auction.highestBidder).transfer(auction.highestBid);
                emit RefundProcessed(auction.highestBidder, auction.highestBid);
            }
        }
    }

    // View Functions
    function getAuction(uint256 _auctionId) external view 
        auctionExists(_auctionId) 
        returns (
            address seller,
            string memory description,
            uint256 startingPrice,
            uint256 reservePrice,
            uint256 startTime,
            uint256 endTime,
            uint256 highestBid,
            address highestBidder,
            bool active,
            bool ended
        ) 
    {
        AuctionItem storage auction = auctions[_auctionId];
        return (
            auction.seller,
            auction.description,
            auction.startingPrice,
            auction.reservePrice,
            auction.startTime,
            auction.endTime,
            auction.highestBid,
            auction.highestBidder,
            auction.active,
            auction.ended
        );
    }

    function getBidAmount(uint256 _auctionId, address _bidder) external view 
        auctionExists(_auctionId) 
        returns (uint256) 
    {
        return bids[_auctionId][_bidder];
    }
}