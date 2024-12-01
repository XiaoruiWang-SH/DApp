const express = require("express");
const app = express();
const cors = require("cors");


const goodsItems = require("./homepage.json");
const itemdesc = require("./itemdesc.json");

app.use(cors());

// Define routes
app.get("/api", (req, res) => {
    console.log("Request Details:");
    console.log("URL:", req.url); // Log the request URL
    console.log("Method:", req.method); // Log the request method (e.g., GET, POST)
    console.log("Headers:", req.headers); // Log the request headers
    console.log("Query Parameters:", req.query); 

    res.json(goodsItems);
});

app.get("/item", (req, res) => {
    res.json(itemdesc);
});

// 404 Error Handling
app.use((req, res) => {
    console.log("Request Details:");
    console.log("URL:", req.url); // Log the request URL
    console.log("Method:", req.method); // Log the request method (e.g., GET, POST)
    console.log("Headers:", req.headers); // Log the request headers
    console.log("Query Parameters:", req.query); 
    console.log("404 Request for req:   " + req);``
  res.status(404).send("404 Not Found");
});

// Start the server
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
