// routes/index.js
const express = require("express");
const router = express.Router();
const db = require("./db"); // Import your MySQL connection module

const ITEMS_PER_PAGE = 5; // Adjust the number of items to display per page as needed

router.get("/", (req, res) => {
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || ITEMS_PER_PAGE;
  const offset = (page - 1) * limit;

  // Fetch data from the database based on pagination parameters
  const query = `SELECT * FROM Members LIMIT ${limit} OFFSET ${offset}`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Fetch total count of items (for calculating total pages)
    db.query(
      "SELECT COUNT(*) AS totalCount FROM Members",
      (countErr, countResults) => {
        if (countErr) {
          console.error(countErr);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
          data: results,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
          },
        });
      }
    );
  });
});

router.get("/mapdata", (req, res) => {
  // Fetch data from the database and send as JSON
  db.query("SELECT Latitude, Longitude FROM Members", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json({ data: results });
  });
});

router.post("/submitForm", (req, res) => {
  const {
    Name,
    FatherName,
    DOB,
    WhNumber,
    District,
    Division,
    Ward,
    PostOffice,
    Address,
    AreaType,
    VoterId,
    BloodGroup,
    Occupation,
    DirectSupport,
    IndirectSupport,
    Latitude,
    Longitude,
    ImagePath,
  } = req.body;
  // console.log(req.body);

  const sql = `
    INSERT INTO Members (Name, FatherName, DOB, WhNumber, District, Division, Ward, 
      PostOffice, Address, AreaType, VoterId, BloodGroup, Occupation, DirectSupport, 
      IndirectSupport, Latitude, Longitude, ImagePath)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    Name,
    FatherName,
    DOB,
    WhNumber,
    District,
    Division,
    Ward,
    PostOffice,
    Address,
    AreaType,
    VoterId,
    BloodGroup,
    Occupation,
    DirectSupport,
    IndirectSupport,
    Latitude,
    Longitude,
    ImagePath,
  ];
  // console.log(values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(201).json({
      message: "Member added successfully",
      memberId: result.insertId,
    });
  });
});

module.exports = router;
