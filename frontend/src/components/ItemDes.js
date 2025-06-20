import React, { useEffect } from "react";
import './ItemDesStyle.css';
import { useState, useContext, useRef } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { AppContext,  AppProvider} from './Context';
import {connectWallet, connection, placeBid, listenForBidPlaced, getAuctionHighest, 
    getBidHistory, getBidCount, endAuction} from '../contracts/interaction';

export default function ItemDes() {
    const hasRun = useRef(false);
    const location = useLocation();
    const {id, isTimeEnd} = location.state || {};
    const [bidclick, setBidclick] = useState(false);
    const [bidhistory, setBidhistory] = useState([]);
    const [bidcount, setBidcount] = useState(0);
    const [publisher, setPublisher] = useState("");
    const [auctionId, setAuctionId] = useState(0);
    const [isEnd, setIsEnd] = useState(false);

    const { login, setLogin, address, setAddress, pagetitle, setPagetitle} = useContext(AppContext);
    setPagetitle("Auction Item Details");

   
    const bidItemClick = () => {
        if (publisher == address && !isEnd) {            
            console.log("Trigger actively Smart Contract to end Auction");
            (
                async () => {
                    const auctionContract = await connection();
                    const [auctionid, winner, amount] = await endAuction(auctionContract, auctionId);
                    if(auctionid == auctionId){
                        console.log("Auction ended successfully, ended auction ID: ", auctionid);
                        setIsEnd(true);
                        await updateItem(id, winner, amount);

                        setTimeout(() => {
                            window.location.reload(); // Reload the page
                          }, 1000); 
                    }
                }
            )();
            return;
        }
        console.log("bidItemClick");
        setBidclick(true);
    };

    const [bidAmount, setBidAmount] = useState(0);
    const [highestbid, setHighestbid] = useState(0);

    const handleChange = (event) => {
        setBidAmount(event.target.value);
    };
    const handleConfirm = async() => {
        alert(`Bid confirmed: CHF ${bidAmount}`);
        setBidclick(false);

        const auctionContract = await connection();
        await listenForBidPlaced(auctionContract);
        const [auctionid, bidder, amount] = await placeBid(auctionContract, item.AuctionId, bidAmount);
        await updateItemByBid(id, bidder, amount);
        
        setTimeout(() => {
            window.location.reload(); // Reload the page
          }, 1000); 

      };


    const [item, setItem] = useState({});

    useEffect(() => {
        if (hasRun.current) return;
        console.log(" Requerst data for itemID: " + id);

        axios.get('/item', {
            params: {
                itemId: id,  
              },
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
                console.log("response.data: ", response.data);
                setItem(response.data);
                setBidAmount(response.data.StartBid);
                setPublisher(response.data.Publisher);
                setAuctionId(response.data.AuctionId);
                setIsEnd(response.data.Status == 1);

                (async () => {
                    const auctionContract = await connection();
                    console.log("item: ", item);
                    console.log("Auction ID: ", response.data.AuctionId);
                    const highest = await getAuctionHighest(auctionContract, response.data.AuctionId);
                    console.log("Highest bid: ", highest);
                    setHighestbid(highest);

                    const count = await getBidCount(auctionContract, response.data.AuctionId);
                    setBidcount(count);
                    console.log("Bid count: ", count);
                    if (count > 0) {
                        const history = await getBidHistory(auctionContract, response.data.AuctionId);
                        console.log("Bid history: ", history);
                        history.reverse();
                        setBidhistory(history);
                    }
                })();

                if (!isEnd) {
                    return;
                }

                if (isEnd && response.data.Status == 1) { 
                    console.log("Smart Contract has ended Auction already");
                    return;
                }

                console.log("Trigger Smart Contract to end Auction");
                (
                    async () => {
                        const auctionContract = await connection();
                        const [auctionid, winner, amount] = await endAuction(auctionContract, response.data.AuctionId);
                        if(auctionid == response.data.AuctionId){
                            console.log("Auction ended successfully, ended auction ID: ", auctionid);
                            await updateItem(id, winner, amount);
                        }
                    }
                )();
                

            })
            .catch((error) => {
                if (error.response) {
                    console.log("Headers:", error.config.headers);
                    console.log("Error Response Data:", error.response.data);
                  } else {
                    console.log("Error:", error.message);
                  }
            });
            hasRun.current = true;
        
    }, [setItem]);

    const updateItem = async (itemId, winner, amount) => {
        try {
            console.log("Update item:", itemId, winner, amount);
            const response = await axios.post('/updateitem', {
                itemId: itemId,
                winner: winner,
                amount: amount,
            });
            console.log("Update item response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating item:", error);
            return {};
        }
    }

    const updateItemByBid = async (itemId, bidder, amount) => {
        try {
            console.log("Update item by bidder:", itemId, bidder, amount);
            const response = await axios.post('/updateitembybid', {
                itemId: itemId,
                bidder: bidder,
                amount: amount,
            });
            console.log("Update item by bidder response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating item:", error);
            return {};
        }
    }

    const bidNormal = () => {
        return (
            <div className="bid-container">
                <button className="item-button" disabled={isEnd} onClick={bidItemClick}>
                    {publisher == address ? "End Auction" : "Bid"}
                </button>
            </div>
        );
      };

      const bidClicked = () => {
        
        return (
            <>  {/* clicked bid button */}
            <div className="bid-container">
                <div className="input-container">
                    <span className="currency">CHF</span>
                    <input
                        type="number"
                        value={bidAmount}
                        onChange={handleChange}
                        className="input"
                        
                    />
                </div>
                <button className="item-button" onClick={handleConfirm}>
                    Confirm
                </button>
            </div>
            </> 
        );
      };

      const BidHistory = ({ historyList }) => {
        // Check if historyList is undefined or empty
        // history.push({bidderV, amountV, timestampV});
        if (!Array.isArray(historyList) || historyList.length === 0) {
            return <p>No bid history available.</p>;
        }

        return (
            <div>
            <text className="bid-history-title">Bid History</text>
            <div className="bid-history-container">
            {bidcount > 0 ? 
            <table className="bid-history-table">
                <thead>
                <tr>
                    <th>Date & Time</th>
                    <th>Bid Amount</th>
                    <th>Bidder</th>
                </tr>
                </thead>
                <tbody>
                {historyList.map((bid, index) => (
                    <tr key={index}>
                    <td>{bid.timestampV}</td>
                    <td>{bid.amountV}</td>
                    <td>{bid.bidderV}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            :
             <div className="bid-history-nobid">
                <text> No bid yet </text>
            </div>
            }
            </div>
            </div>
          );
      };

  return (
    <div className="page-container">
        <div className="goodsImg">
            <img src={item.Imgurl} alt={"title"} crossOrigin="anonymous"/>
        </div>
        <div className="activityArea">
            <div className="goodsInfo">
                {/* title & desc information */}
                <h3>{item.Title}</h3>
                <p>{item.Des}</p>
            </div>
            <hr/>
            <div className="auctionInfo">
                {/* display information accross */}
                <div className="acutionItem">
                    {/* starting bid */}
                    <text>Starting Bid </text>
                    <text>{item.StartBid} </text>
                </div>
                <div className="acutionItem">
                    {/* current highest bid */}
                    <text>Current highest bid </text>
                    <text>{highestbid} </text>
                </div>
                <div  className="acutionItem">
                    {/* total bid */}
                    <text>Total Bid </text>
                    <text>{bidcount} </text>
                </div>
                <div className="acutionItem">
                    {/* end time */}
                    <text>End Time </text>
                    <text>{item.EndTime} </text>
                </div>
            </div>
            <hr/>
            <div className="bidArea">
                {/* bid area */}
                <BidHistory historyList={bidhistory} />
                {bidclick ? bidClicked() : bidNormal()}
                <div>
                    {/* history */}
                </div>
            </div>
                
        </div>
    </div>
  );
}