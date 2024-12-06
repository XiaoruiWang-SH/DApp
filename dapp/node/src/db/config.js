const mysql = require("mysql2/promise");

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: "localhost",    // MySQL server hostname
  user: "root",         // MySQL username
  password: "",         // MySQL password
  database: "auctiondb",   // MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// SQL query to create the table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS auctionItems2 (
      id INT AUTO_INCREMENT PRIMARY KEY,        -- Unique identifier for each item
      Title VARCHAR(255) NOT NULL,              -- Title of the item
      Des TEXT,                                 -- Description of the item
      Imgurl TEXT,
      StartBid INT DEFAULT 0,                   -- Starting bid
      CurrentHighest INT DEFAULT 0,            -- Current highest bid (e.g., money)
      Total INT DEFAULT 0,                      -- Total bids or count
      StartTime DATETIME NOT NULL,              -- Auction start time
      EndTime DATETIME NOT NULL,                -- Auction end time
      Status INT DEFAULT 0,                     -- Status of the item, 0 = available, 1 = sold
      Publisher VARCHAR(255) NOT NULL,          -- Publisher's name or ID
      Owner VARCHAR(255) NOT NULL,              -- Owner's name or ID
      Favorites INT DEFAULT 0                   -- Total favorites or likes
  );
`;

// Function to ensure the table exists
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(createTableQuery);
    console.log("Table `auctionItems2` created or already exists.");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Error creating table:", err);
    throw err;
  }
};

// Initialize the database when the module is imported
initializeDatabase();

module.exports = pool;

