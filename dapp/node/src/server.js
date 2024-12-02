const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const { getItems, addItem } = require("./db/queries");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const goodsItems = require("./homepage.json");
const itemdesc = require("./itemdesc.json");


const PORT = 3030;

app.use(cors());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(path.dirname(__dirname), "uploads")));

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

// CREATE TABLE IF NOT EXISTS auctionItems (
//     id INT AUTO_INCREMENT PRIMARY KEY,        -- Unique identifier for each item
//     Title VARCHAR(255) NOT NULL,              -- Title of the item
//     Des TEXT,                                 -- Description of the item
//     CurrentHighest INT DEFAULT 0,  -- Current highest bid (e.g., money)
//     Total INT DEFAULT 0,                      -- Total bids or count
//     StartTime DATETIME NOT NULL,              -- Auction start time
//     EndTime DATETIME NOT NULL,                -- Auction end time
//     Status INT DEFAULT 0,                     -- Status of the item
//     Publisher VARCHAR(255) NOT NULL,          -- Publisher's name or ID
//     Owner VARCHAR(255) NOT NULL,              -- Owner's name or ID
//     Favorites INT DEFAULT 0                   -- Total favorites or likes
// );

// Get the current datetime
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");

(async () => {
    try {
      // Add an item
      const newItemId = await addItem(
        "Vintage Lamp",
        "A beautiful vintage lamp from the 1950s.",
        50,
        10,
        currentDate,
        currentDate,
        1,
        "JohnDoe",
        "JaneDoe",
        5
      );
      console.log("New Item ID:", newItemId);
  
      // Fetch all items
      const items = await getItems();
      console.log("All Items:", items);
    } catch (err) {
      console.error("Error:", err);
    }
  })();

// Endpoint to handle image uploads
app.post("/uploads", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.send({ message: "Image uploaded successfully", filePath: req.file.path, fileUrl: fileUrl });
});


// Define routes
app.get("/api", async (req, res) => {
    console.log("Request Details:");
    console.log("URL:", req.url); // Log the request URL
    console.log("Method:", req.method); // Log the request method (e.g., GET, POST)
    console.log("Headers:", req.headers); // Log the request headers
    console.log("Query Parameters:", req.query); 


    const goodsItems =  await getItems();

    console.log("Goods Items:", goodsItems);

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
