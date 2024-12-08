import React, { useState, useContext } from "react";
import "./PublishPageFakeStyle.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AppContext,  AppProvider} from './Context';
import {connectWallet, connection, registerUser, listenForUserRegistration, isUserRegistered, createAuction, listenForAuctionCreated} from '../contracts/interaction';

export default function PublishPageFake() {

  const { login, setLogin, address, setAddress, pagetitle, setPagetitle} = useContext(AppContext);
  setPagetitle("Publish an auction item");
 
  const [title, setTitle] = useState("");
  const [pictures, setPictures] = useState([]);
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState(0);
  const [enddatetime, setEnddatetime] = useState("");
  const [enddate, setEnddate] = useState("");
  const [endtime, setEndtime] = useState("");
  const [message, setMessage] = useState("");
  const [pictureurl, setPictureurl] = useState("");

  const navigate = useNavigate();


  const handleImageUpload = async (event) => {
    console.log("Files:", event.target.files);
    console.log('access address:', address);
    
    

    const img = event.target.files[0];
    if (!img) {
        return;
    }
    const formData = new FormData();
    formData.append("image", img);

    try {
    const response = await axios.post("/uploads", formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        },
    });
    console.log("Image uploaded:", response.data);
    const fileUrl = response.data.fileUrl;
    if (fileUrl) {
        setPictureurl(fileUrl);
    }
    setMessage(response.data.message || "Image uploaded successfully!");
    } catch (error) {
    console.error("Error uploading image:", error);
    setMessage("Failed to upload the image. Please try again.");
    }
    
    const files = Array.from(event.target.files);
    setPictures((prev) => [...prev, ...files]);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (event) => {
    console.log("address:", address);
    if (!address || address === "fake") {
        alert("Please login");
        return;
    }

    if (!title || !pictures.length || !description || !startingBid || !enddate || !endtime) {
      alert("Please fill in all the fields");
      return;
    }

    event.preventDefault();

    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);

    const endDateTime = new Date(`${enddate}T${endtime}`);
    const formattedEndDateTime = formatDate(endDateTime);
    
    // const createAuction = async (contract, title, startingPrice, reservePrice, startDate, endDate) 
    try {
      const auctionContract = await connection();
      const auctionId = await createAuction(auctionContract, title, startingBid, startingBid, formattedCurrentDate, formattedEndDateTime);
      const auctionid = auctionId.toString();
      const formData = {
        auctionid,
        address,
        title,
        pictureurl,
        description,
        startingBid,
        formattedCurrentDate,
        formattedEndDateTime,
      };
      console.log("Form Submitted:", formData);
      try {
      const response = await axios.post("/publish", formData, {
          headers: {
              'Content-Type': 'application/json',
          },
      });
      console.log("publish Response:", response.data);
      } catch (error) {
          console.error("Error handleSubmit:", error);
      }


      await listenForAuctionCreated(auctionContract, async (auctionId_callback, address, title) => {
            console.log("AuctionCreated in publish page: ", auctionId_callback.toString(), address, title);
            // const auctionid = auctionId.toString();

            
        });
    } catch (error) {
        console.error("Error creating auction:", error);
    }
    alert(`Publish Successful: ${title}`);
    navigate("/");


  };

  return (
    <div className="form-container">
      {/* <div className="form-title">
        <text>Publish an auction item</text>
      </div> */}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
          className="form-group-items"
            type="text"
            id="title"
            value={title}
            placeholder="please input auction item's title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Pictures */}
        <div className="form-group">
          <label>Pictures:</label>
          <div className="pictures-container">
            {pictures.map((picture, index) => (
              <div className="picture-preview" key={index}>
                <img
                  src={URL.createObjectURL(picture)}
                  alt={`upload-${index}`}
                />
              </div>
            ))}
            <div className="add-picture">
              <label htmlFor="upload" className="add-picture-label">
                +
              </label>
              <input className="form-group-items"
                type="file"
                id="upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea className="form-group-items"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description"
          ></textarea>
        </div>

        {/* Starting Bid */}
        <div className="form-group">
          <label htmlFor="startingBid">Starting bid:</label>
          <input className="form-group-items"
            type="number"
            id="startingBid"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            min="0"
          />
        </div>

        {/* End Time */}
        <div className="form-group">
          <label htmlFor="EndTime">End Time:</label>
          <div className="endTimeBlock">
          <input
            className="endtime-date"
            type="date"
            id="enddate"
            value={enddate}
            onChange={(e) => setEnddate(e.target.value)}
          />
          <input
          className="endtime-time"
            type="time"
            id="endTime"
            value={endtime}
            onChange={(e) => setEndtime(e.target.value)}
          />
          </div>
          
        </div>
        

        {/* Submit Button */}
        <button type="submit" className="publish-button">
          Publish
        </button>
      </form>
    </div>
  );

};

