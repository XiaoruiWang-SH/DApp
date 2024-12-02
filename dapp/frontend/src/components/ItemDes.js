import React, { useEffect } from "react";
import './ItemDesStyle.css';
import { useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';

export default function ItemDes() {
    const location = useLocation();
    const {id} = location.state || {};
    console.log("itemID: " + id);
    const [bidclick, setBidclick] = useState(false);

    const bidItemClick = () => {
        console.log("bidItemClick");
        setBidclick(true);
    };

    const [bidAmount, setBidAmount] = useState(9500);

    const handleChange = (event) => {
        setBidAmount(event.target.value);
    };
    const handleConfirm = () => {
        alert(`Bid confirmed: CHF ${bidAmount}`);
        setBidclick(false);
      };


    const [item, setItem] = useState({});

    useEffect(() => {
        console.log(" Requerst data for itemID: " + id);

        axios.get('/item', {
            params: {
                itemId: id,  
              },
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
                console.log(response.data);
                setItem(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    console.log("Headers:", error.config.headers);
                    console.log("Error Response Data:", error.response.data);
                  } else {
                    console.log("Error:", error.message);
                  }
            });

        
    }, [setItem]);

    const bidHistory = [
        { "date": "2024-11-30 14:35", "price": "CHF 9600" },
        { "date": "2024-11-30 14:20", "price": "CHF 9400" },
        { "date": "2024-11-30 14:05", "price": "CHF 9300" },
        { "date": "2024-11-30 13:50", "price": "CHF 9200" }
    ];

    const bidNormal = () => {
        return (
            <div className="bid-container">
                <button className="item-button" onClick={bidItemClick}>
                    Bid
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
        if (!Array.isArray(historyList) || historyList.length === 0) {
            return <p>No bid history available.</p>;
        }

        return (
            <>
            <text>Bid History</text>
            <div className="bid-history-container">
            <table className="bid-history-table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Bid Price</th>
                </tr>
                </thead>
                <tbody>
                {historyList.map((bid, index) => (
                    <tr key={index}>
                    <td>{bid.date}</td>
                    <td>{bid.price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            </>
          );
      };
      console.log("item.image: " + item.image);

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
                    <text>{item.CurrentHighest} </text>
                </div>
                <div  className="acutionItem">
                    {/* total bid */}
                    <text>Total Bid </text>
                    <text>{item.Total} </text>
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
                <BidHistory historyList={bidHistory} />
                {bidclick ? bidClicked() : bidNormal()}
                <div>
                    {/* history */}
                </div>
            </div>
                
        </div>
    </div>
  );
}