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

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    } // used to record bids history for each auction

    // State variables
    mapping(uint256 => AuctionItem) public auctions; // Stores all auctions, mapped by their unique ID，
    // call it will return the info of an auction

    mapping(address => bool) public registeredUsers; // checked if user is registered
    mapping(uint256 => mapping(address => uint256)) public bids;   // Records bids for each auction by bidder address, 
    //call it will return as followed: bids[auctionId][Bob] = 2 ether
    mapping(uint256 => Bid[]) public bidHistory; // record specific auction bid history, 
    // call it will return the history of an auction     
    uint256 public auctionCounter; // Counter to assign unique IDs to auctions.

    // Events--used for logging and interacting with frontend
    event UserRegistered(address user);
    event AuctionCreated(uint256 auctionId, address seller, string description);
    event BidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);
    event RefundProcessed(address bidder, uint256 amount);

    
    // Modifiers for access control
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
    // registerUser(): register the caller(based on the user's address), 
    // a user cannot double register.
    function registerUser() external {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    } 

    // createAuction(input info of an item):  call it will generate an auction
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

        bidHistory[_auctionId].push(Bid({
            bidder: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }

    // endAuction(input id of an auction): can be access by any user 
    // if input value _auctionId exists, but will only execute successfully only if :
    // the caller is seller or the auction time of this item is over. 

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
    // input an Id of an auction and will output the info of it
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

    // input an Id and and address of a bidder, it will output the bidder's price, 
    // if a bidder bids this auction twice, it will output the latter time's bid price
    function getBidAmount(uint256 _auctionId, address _bidder) external view 
        auctionExists(_auctionId) 
        returns (uint256) 
    {
        return bids[_auctionId][_bidder];
    }

    // input an Id of an auction
    // it will output the bid info  of the bidder on this auction
    function getBidHistory(uint256 _auctionId) external view 
        auctionExists(_auctionId)
        returns (address[] memory bidders, uint256[] memory amounts, uint256[] memory timestamps)
    {
        Bid[] storage history = bidHistory[_auctionId];
        uint256 length = history.length;
        
        bidders = new address[](length);
        amounts = new uint256[](length);
        timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            bidders[i] = history[i].bidder;
            amounts[i] = history[i].amount;
            timestamps[i] = history[i].timestamp;
        }
        
        return (bidders, amounts, timestamps);
    }

    // getBidCount(input uint256 Id of an auction): 
    // output how many times it has been bidded
    function getBidCount(uint256 _auctionId) external view 
        auctionExists(_auctionId)
        returns (uint256)
    {
        return bidHistory[_auctionId].length;
    }
}