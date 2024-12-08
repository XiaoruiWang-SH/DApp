
const pool = require("./config");

// Fetch all items
const getItems = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM auctionItems3"); // Corrected table name
    return rows;
  } catch (err) {
    console.error("Error fetching items:", err);
    throw err;
  }
};

const getItemById = async (id) => {
    try {
      // Parameterized query to fetch the item by id
      const [rows] = await pool.query("SELECT * FROM auctionItems3 WHERE id = ?", [id]);
      return rows[0]; // Return the first matching row (or undefined if not found)
    } catch (err) {
      console.error("Error fetching item by id:", err);
      throw err;
    }
  };

  const getItemsMypublish = async (publisher) => {
    try {
      // Parameterized query to fetch the item by id
      const [rows] = await pool.query("SELECT * FROM auctionItems3 WHERE Publisher = ?", [publisher]);
      return rows; // Return the first matching row (or undefined if not found)
    } catch (err) {
      console.error("Error fetching item by id:", err);
      throw err;
    }
  };

  const getItemsMybought = async (owner) => {
    try {
      // Parameterized query to fetch the item by id
      const [rows] = await pool.query("SELECT * FROM auctionItems3 WHERE Owner = ?", [owner]);
      return rows; // Return the first matching row (or undefined if not found)
    } catch (err) {
      console.error("Error fetching item by id:", err);
      throw err;
    }
  };

  const updateItem = async (id, winner, amount) => {
    try {
      const [result] = await pool.query(
        "UPDATE auctionItems3 SET Status = 1, Owner = ?, CurrentHighest = ? WHERE id = ?",
        [winner, amount, id]
      );
      return result.affectedRows;
    } catch (err) {
      console.error("Error updating item:", err);
      throw err;
    }
  };

  const updateItemByBid = async (id, bidder, amount) => {
    try {
      const [result] = await pool.query(
        "UPDATE auctionItems3 SET Total = Total + 1, CurrentHighest = ? WHERE id = ?",
        [amount, id]
      );
      return result.affectedRows;
    } catch (err) {
      console.error("Error updating item:", err);
      throw err;
    }
  };
  

// Insert a new item
const addItem = async (auctionid, title, des, imgurl, startBid, currentHighest, total, startTime, endTime, status, publisher, owner, favorites) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO auctionItems3 (AuctionId, Title, Des, Imgurl, StartBid, CurrentHighest, Total, StartTime, EndTime, Status, Publisher, Owner, Favorites) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [auctionid, title, des, imgurl, startBid, currentHighest, total, startTime, endTime, status, publisher, owner, favorites]
    );
    return result.insertId;
  } catch (err) {
    console.error("Error adding item:", err);
    throw err;
  }
};

module.exports = { getItems, getItemById, getItemsMypublish, getItemsMybought, updateItem, updateItemByBid, addItem };

