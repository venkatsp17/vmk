// app.js
const express = require("express");
const app = express();
const db = require("./db"); // Import your MySQL connection module
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes
const indexRoutes = require("./routes.js");
app.use("/", indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

///work in frontend
//continuation
