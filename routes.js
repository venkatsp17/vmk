// routes/index.js
const express = require("express");
const router = express.Router();
const db = require("./db"); // Import your MySQL connection module
const PDFDocument = require("pdfkit");

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
    BoothNumber, //new
    BoothAddress, //new
    RefId, //new
    BloodGroup,
    DirectSupport,
    IndirectSupport,
    Latitude,
    Longitude,
    ImagePath,
  } = req.body;
  // console.log(req.body);

  const sql = `
    INSERT INTO Members (Name, FatherName, DOB, WhNumber, District, Division, Ward, 
      PostOffice, Address, AreaType, VoterId, BloodGroup, DirectSupport, 
      IndirectSupport, Latitude, Longitude, ImagePath, BoothNumber, BoothAddress, RefId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    BoothNumber, //new
    BoothAddress, //new
    RefId, //new
    BloodGroup,
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

router.post("/check-refid", (req, res) => {
  const refid = req.body.refid;

  // Check if refid is provided in the request body
  if (!refid) {
    return res.status(400).send("Refid is required in the request body");
  }

  // MySQL query to check if refid exists
  const sql = "SELECT COUNT(*) AS count FROM Members WHERE VoterId = ?";
  db.query(sql, [refid], (error, results) => {
    if (error) {
      console.error("Error executing MySQL query: " + error);
      res.status(500).send("Internal Server Error");
      return;
    }

    const count = results[0].count;
    if (count > 0) {
      res.status(200).send("Verified!");
    } else {
      res.status(404).send("Does not exist!");
    }
  });
});

router.get("/count-all-values", (req, res) => {
  // MySQL query to count all values in the table
  const sql = "SELECT COUNT(*) AS count FROM Members";
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing MySQL query: " + error);
      res.status(500).send("Internal Server Error");
      return;
    }
    const count = results[0].count;
    res.status(200).json({ count });
  });
});

router.get("/district-count", (req, res) => {
  // MySQL query to get count of all values from district column
  const sql =
    "SELECT District, COUNT(*) AS count FROM Members GROUP BY District";
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error executing MySQL query: " + error);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.status(200).json(results);
  });
});

router.put("/update-mem/:id", (req, res) => {
  const itemId = req.params.id;
  const newData = req.body;
  console.log(newData);
  // Update query
  const sql = "UPDATE Members SET ? WHERE Id = ?";

  db.query(sql, [newData, itemId], (err, result) => {
    if (err) {
      console.error("Error updating item: ", err);
      res.status(500).json({ error: "Failed to update item" });
      return;
    }
    console.log("Item updated successfully");
    res.status(200).json({ message: "Item updated successfully" });
  });
});

// Route to delete an item
router.delete("/del-mem/:id", (req, res) => {
  const itemId = req.params.id;

  // Delete query
  const sql = "DELETE FROM Members WHERE Id = ?";

  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.error("Error deleting item: ", err);
      res.status(500).json({ error: "Failed to delete item" });
      return;
    }

    console.log("Item deleted successfully");
    res.status(200).json({ message: "Item deleted successfully" });
  });
});

router.get("/search", (req, res) => {
  const searchTerm = req.query.term;
  const cur_page = req.query.current_pge;
  const col = req.query.col;

  // SQL query to search for data
  const query = `SELECT * FROM Members WHERE ${col} LIKE '%${searchTerm}%'`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error searching data:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    // Fetch total count of items (for calculating total pages)
    db.query(
      `SELECT COUNT(*) AS totalCount FROM Members`,
      (countErr, countResults) => {
        if (countErr) {
          console.error(countErr);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / 10);

        res.json({
          data: results,
          pagination: {
            currentPage: cur_page,
            totalPages: totalPages,
            totalItems: totalCount,
            itemsPerPage: 10,
          },
        });
      }
    );
    // res.json(results);
  });
});

router.get("/export-pdf", (req, res) => {
  const selectedDistrict = req.query.district;
  // MySQL query to fetch members data based on the selected district
  const query = `SELECT ID, Name, FatherName, District, Ward, VoterId, BloodGroup, BoothNumber, WhNumber FROM Members`;
  db.query(query, [selectedDistrict], (err, results) => {
    if (err) {
      console.error("Error fetching data from MySQL: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Generate PDF
    const doc = new PDFDocument({ size: "letter", layout: "landscape" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=members_data_${selectedDistrict
        .replace(/\s+/g, "_")
        .toLowerCase()}.pdf`
    );

    // Table headers
    const headers = [
      "ID",
      "Name",
      "Father's Name",
      "District",
      "Ward",
      "Voter ID",
      "Blood Group",
      "Booth Number",
      "Number",
    ];

    // Table column widths
    const colWidths = [30, 100, 120, 80, 70, 80, 100, 80, 100, 100];
    doc.text(`Members Data for ${selectedDistrict}`, { align: "center" });
    doc.moveDown();
    const drawPage = (startRowIndex, endRowIndex) => {
      // Draw table headers
      doc.font("Helvetica-Bold").fontSize(10);
      let x = 30;
      let y = 90;
      headers.forEach((header, index) => {
        doc.text(header, x, y, { width: colWidths[index], align: "center" });
        x += colWidths[index];
      });

      // Draw table rows
      doc.font("Helvetica").fontSize(10);
      for (
        let i = startRowIndex;
        i < Math.min(endRowIndex, results.length);
        i++
      ) {
        let x = 30;
        let y = 120 + (i - startRowIndex) * 25;
        Object.values(results[i]).forEach((value, index) => {
          doc.text(value !== null ? value.toString() : "", x, y, {
            width: colWidths[index],
            align: "center",
          });
          x += colWidths[index];
        });
      }
    };

    const rowsPerPage = 15;
    let currentPage = 1;
    let startRowIndex = 0;
    let endRowIndex = Math.min(rowsPerPage, results.length);

    // Draw pages of data until all rows are processed
    while (startRowIndex < results.length) {
      drawPage(startRowIndex, endRowIndex); // Draw the current page of data
      if (endRowIndex < results.length) {
        doc.addPage(); // Add a new page if there are more rows remaining
      }
      startRowIndex = endRowIndex; // Move to the next set of rows
      endRowIndex = Math.min(startRowIndex + rowsPerPage, results.length);
      currentPage++;
    }

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=members_data_${selectedDistrict
          .replace(/\s+/g, "_")
          .toLowerCase()}.pdf`
      );
      res.send(pdfData);
    });
    doc.end();
  });
});

router.get("/members", (req, res) => {
  db.query("SELECT DOB, District FROM Members", (error, results) => {
    if (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
