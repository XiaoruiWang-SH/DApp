# D-Auction System
## App Theme
D-Auction System is a decentralized auction web app, it uses block chain technolgy to protect business fairness, transparency and security. Anyone can register as a user and you will have right to publish auction items and bid auction items automatically, there is totally free for all.

## Introduction for App
In D-Auction System website, you can browse all items that can be bided for all users. We use grid layout for item display, you can see the general information about an item displayed in cards, on which there are information including a picture of the item, item title, starting bid price, current highest bid price, the number of total bids currently, and the auction end time. 

If you have more interests in this item, you can click the card, then you enter into the item description page, on which you can see more information about this item, including all bids history and you also you can make a bid on this page. 

There is also a publish page, on that you can publish items that you want to sold. It can be displayed in the "My Published" page which you can enter into by clicking the popup item in user center. And also you can check items you have bought by the way as same as checking your published items.

## Implementation
For implementation of this project, we use many technologies. Generally, the project can split to two parts, on-chain part and off-chain part:
* On-chain part:
    - Smart contract written by solidity
    - Delopy locally using Hardhat 

* Off-chain part:
    - Frontend: 
        - Using React building web page
        - Using CSS to design style
        - Using axios to handle http request
        - Using ethers.js to interact with smart contract code
    - Backend node server:
        - Using express.js handle requests from client
        - Using multer.js to hanlde images uploading  
        - Using mysql2.js to interact with local mysql database
    - Database
        - Local mysql database

        

## Challenges and Solutions
**1. Data Storage accross on-chain and off-chain**

For an auction system, we have a lot of information needed to save, e.g. Auciton items information needs to save like title, description, image, something related to bid, status, ect. And user information also need to save. So there is an issue that we can't save all information into on-chain, because it's cost is expensive. 

So we decided that only information that related to transaction can be saved in on-chain, like bid amout, date, address from where to where, and users' rigisteration information is just a wallet address. Others information all saved in off-chain, we can only create a table saving the map item id in off-chain to the item id in on-chain. 

**2. Data Synchronization for all users**

At the beginning, we just want to build a pure frontend website for auction system. But we find if we do in this way, we can't synchronization data for users, beause for a auction system we have to support publishing items, and all users can join in one auction activity. So, there must be a data synchronization mechanism to support these. 

So, we built a node server and a mysql database as well. All auction items information saved in database though node server, frontend website is only responsible for ui display and making requests data from node server. In this way we soloved the data synchronization problem.


**3. Transfer currency on block chain**

As we all know, in an auction system, the highest bidder wins. But for failed people they should get refound. But when and how to refound them, at the end time of auction? Yes, this way can be doable, but is not the best way. Because if we do in this way, we will handle maybe so many refound transaction at same time when acution is ended. This poses significant system risks and can lead to very high transaction peaks.

So we dicide that biders get their refound as soon as when another bid appears, with this method, we have leveled out these transaction peaks withour system risks.


 




