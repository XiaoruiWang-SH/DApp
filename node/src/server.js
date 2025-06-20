const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const { getItems, getItemById, addItem, getItemsMypublish, getItemsMybought, updateItem, updateItemByBid } = require("./db/queries");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const goodsItems = require("./homepage.json");
const itemdesc = require("./itemdesc.json");
const { get } = require("http");


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


// Get the current datetime
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");

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
    // console.log("Request Details:");
    // console.log("URL:", req.url); // Log the request URL
    // console.log("Method:", req.method); // Log the request method (e.g., GET, POST)
    // console.log("Headers:", req.headers); // Log the request headers
    // console.log("Query Parameters:", req.query); 

    let goodsItems = [];
    try {
        goodsItems =  await getItems();
    } catch (error) {
        console.error("Error:", error);
    }
    
    console.log("Goods Items:", goodsItems);
    res.json(goodsItems.reverse());
});

app.get("/item", async (req, res) => {
    console.log("Request Details:");
    const { itemId } = req.query;
    console.log("Request Details - itemid:" + itemId);
    let auctionitem = {};
    try {
        auctionitem = await getItemById(itemId);
    } catch (error) {
        console.error("Error:", error);
    }
    console.log("Item Description:", auctionitem);
    res.json(auctionitem);
});

app.get("/mypublish", async (req, res) => {
  const { address } = req.query;
  console.log("Request Details - address:" + address);
  let auctionitem = [];
  try {
      auctionitem = await getItemsMypublish(address);
  } catch (error) {
      console.error("Error:", error);
  }
  console.log("Item Description:", auctionitem);
  res.json(auctionitem.reverse());
});


app.post("/updateitem", async (req, res) => {
  const { itemId, winner, amount } = req.body;
  console.log("updateItem: Request Details - itemid:" + itemId + " winner:" + winner + " amount:" + amount);
  let auctionitem = {};
  try {
      auctionitem = await updateItem(itemId, winner, amount);
  } catch (error) {
      console.error("Error:", error);
  }
  console.log("Item Description:", auctionitem);
  res.json(auctionitem);
});

app.post("/updateitembybid", async (req, res) => {
  const { itemId, bidder, amount } = req.body;
  console.log("updateitembybid: Request Details - itemid:" + itemId + " bidder:" + bidder + " amount:" + amount);
  let auctionitem = {};
  try {
      auctionitem = await updateItemByBid(itemId, bidder, amount);
  } catch (error) {
      console.error("Error:", error);
  }
  console.log("Item Description:", auctionitem);
  res.json(auctionitem);
});

  
  // const formData = {
  //   auctionId,
  //   address,
  //   title,
  //   pictureurl,
  //   description,
  //   startingBid,
  //   formattedCurrentDate,
  //   formattedEndDateTime,
  // };

app.post("/publish", async (req, res) => {
    const { auctionid, address, title, pictureurl, description, startingBid, formattedCurrentDate, formattedEndDateTime } = req.body;
  
    console.log("Received data:", {auctionid, address, title, pictureurl, description, startingBid, formattedCurrentDate, formattedEndDateTime });

    try {
        // Add an item
        const newItemId = await addItem(
          auctionid,
            title,
            description, 
            pictureurl, 
            startingBid,
            0,
            0,
            formattedCurrentDate,
            formattedEndDateTime,
            0,
          address,
          "",
          0
        );
        console.log("New Item ID:", newItemId);
    
        // Fetch all items
        // const items = await getItems();
        // console.log("All Items:", items);
      } catch (err) {
        console.error("Error:", err);
      }
  
    // Respond to the client
    res.json({
      message: "Item created successfully",
      data: { title, description },
    });
  });

  app.get("/mybought", async (req, res) => {
    const { address } = req.query;
    console.log("Request Details - address:" + address);
    let auctionitems = [];
    try {
        auctionitems = await getItemsMybought(address);
    } catch (error) {
        console.error("Error:", error);
    }
    console.log("Item Description:", auctionitems);
    res.json(auctionitems.reverse());
  });

// 404 Error Handling
app.use((req, res) => {
    // console.log("Request Details:");
    // console.log("URL:", req.url); // Log the request URL
    // console.log("Method:", req.method); // Log the request method (e.g., GET, POST)
    // console.log("Headers:", req.headers); // Log the request headers
    // console.log("Query Parameters:", req.query); 
    // console.log("404 Request for req:   " + req);``
  res.status(404).send("404 Not Found");
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
