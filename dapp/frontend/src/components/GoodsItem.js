import React from 'react';
import './GoodsItemStyle.css';

export default function GoodsItem({ title, image, startBid, highestBid, totalBids, endTime, onClick }) {
    // console.log("highestBid:" + highestBid);
    // console.log("totalBids:" + totoalBids);
  return (
    <div className="card" onClick={onClick}>
      <img src={image} alt={title} className="card-image" />
    
      <div className="card-content">
        <p className="card-title">{title}</p>
        <hr />
        <div className="card-bid">
            <text className='left-text'>Start Bid: </text>
            <text className='right-text'>{startBid}</text>
        </div>
        <div className="card-bid">
            <text className='left-text'>Highest Bid: </text>
            <text className='right-text'>{highestBid}</text>
        </div>
        <div className="card-bid">
            <text className='left-text'>Total Bids: </text>
            <text className='right-text'>{totalBids}</text>
        </div>
        <div className="card-bid">
            <text className='left-text'>End Time: </text>
            <text className='right-text'>{endTime}</text>
        </div>

        
      </div>
    </div>
  );
};
