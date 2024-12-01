const express = require("express");
const app = express();

// Define routes
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page");
});

app.get("/about", (req, res) => {
  res.send("About Us Page");
});

// 404 Error Handling
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Start the server
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
