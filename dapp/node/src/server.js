const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const goodsItems = require("./homepage.json");
const itemdesc = require("./itemdesc.json");

const PORT = 3030;

app.use(cors());

const mysql = require("mysql2");

// Create a connection
const db = mysql.createConnection({
  host: "localhost",    // MySQL server hostname
  user: "root",         // MySQL username
  password: "", // MySQL password
  database: "testdb",   // MySQL database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }
    console.log("Connected to MySQL database.");
  });

  // SQL query to create the table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      age INT NOT NULL
    );
  `;
  
  // Example query
  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return;
    }
    console.log("Table created successfully.");
    console.log("Users:", results);
  });

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

// Endpoint to handle image uploads
app.post("/uploads", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.send({ message: "Image uploaded successfully", filePath: req.file.path, fileUrl: fileUrl });
});


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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
