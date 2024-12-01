const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");


const goodsItems = require("./homepage.json");
const itemdesc = require("./itemdesc.json");

app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(path.dirname(__dirname), "uploads");
        console.log("Upload Path: " + uploadPath);
      cb(null, uploadPath); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
  });
  
const upload = multer({ storage });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle image uploads
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send({ message: "Image uploaded successfully", filePath: req.file.path });
});

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));



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
