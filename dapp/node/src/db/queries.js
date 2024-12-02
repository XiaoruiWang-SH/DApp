
const pool = require("./config");

// Fetch all items
const getItems = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM auctionItems"); // Corrected table name
    return rows;
  } catch (err) {
    console.error("Error fetching items:", err);
    throw err;
  }
};

const getItemById = async (id) => {
    try {
      // Parameterized query to fetch the item by id
      const [rows] = await pool.query("SELECT * FROM auctionItems WHERE id = ?", [id]);
      return rows[0]; // Return the first matching row (or undefined if not found)
    } catch (err) {
      console.error("Error fetching item by id:", err);
      throw err;
    }
  };
  

// Insert a new item
const addItem = async (title, des, imgurl, startBid, currentHighest, total, startTime, endTime, status, publisher, owner, favorites) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO auctionItems (Title, Des, Imgurl, StartBid, CurrentHighest, Total, StartTime, EndTime, Status, Publisher, Owner, Favorites) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, des, imgurl, startBid, currentHighest, total, startTime, endTime, status, publisher, owner, favorites]
    );
    return result.insertId;
  } catch (err) {
    console.error("Error adding item:", err);
    throw err;
  }
};

module.exports = { getItems, getItemById, addItem };

