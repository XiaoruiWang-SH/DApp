import React, { useState } from "react";
import "./PublishPageFakeStyle.css";
import axios from 'axios';

export default function PublishPageFake() {
 
  const [title, setTitle] = useState("");
  const [pictures, setPictures] = useState([]);
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState(0);
  const [startingTime, setStartingTime] = useState("");
  const [message, setMessage] = useState("");

  const handleImageUpload = async (event) => {
    console.log("Files:", event.target.files);
    const img = event.target.files[0];
    if (!img) {
        return;
    }
    const formData = new FormData();
    formData.append("image", img);

    try {
    const response = await axios.post("/upload", formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        },
    });
    console.log("Image uploaded:", response.data);
    setMessage(response.data.message || "Image uploaded successfully!");
    } catch (error) {
    console.error("Error uploading image:", error);
    setMessage("Failed to upload the image. Please try again.");
    }
    
    const files = Array.from(event.target.files);
    setPictures((prev) => [...prev, ...files]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      title,
      pictures,
      description,
      startingBid,
      startingTime,
    };
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            placeholder="please input goods title"
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
              <input
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
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description"
          ></textarea>
        </div>

        {/* Starting Bid */}
        <div className="form-group">
          <label htmlFor="startingBid">Starting bid:</label>
          <input
            type="number"
            id="startingBid"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            min="0"
          />
        </div>

        {/* Starting Time */}
        <div className="form-group">
          <label htmlFor="startingTime">Starting Time:</label>
          <input
            type="text"
            id="startingTime"
            value={startingTime}
            placeholder="YYYY/MM/DD - YYYY/MM/DD"
            onChange={(e) => setStartingTime(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="publish-button">
          Publish
        </button>
      </form>
    </div>
  );

};

