const mysql = require("mysql2/promise");

// Database configuration
const config = {
  host: "localhost",    // MySQL server hostname
  user: "root",         // MySQL username
  password: "",         // MySQL password
  database: "auctiondb" // MySQL database name
};

// SQL query to create the database if it doesn't exist
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${config.database};`;

// SQL query to create the table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS auctionItems3 (
      id INT AUTO_INCREMENT PRIMARY KEY,        -- Unique identifier for each item
      AuctionId BIGINT DEFAULT 0,               -- Auction ID in the blockchain
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
    // Create a connection to MySQL server without specifying the database
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password
    });
    // Create the database if it doesn't exist
    await connection.query(createDatabaseQuery);
    console.log(`Database \`${config.database}\` created or already exists.`);
    connection.end(); // Close this connection

    // Create a connection pool for the specific database
    const pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      dateStrings: true
    });

    const connectionFromPool = await pool.getConnection();
    await connectionFromPool.query(createTableQuery);
    console.log("Table `auctionItems3` created or already exists.");
    connectionFromPool.release(); // Release the connection back to the pool

    return pool;
  } catch (err) {
    console.error("Error creating table:", err);
    throw err;
  }
};

// Initialize the database when the module is imported
const poolPromise = initializeDatabase();

module.exports = poolPromise;

