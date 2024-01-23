const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3306;

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Handlebars setup
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);
app.set("view engine", "handlebars");

// Body parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static files setup
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.post("/add", (req, res) => {
  const { amount, category, notes, date } = req.body;

  const insertQuery =
    "INSERT INTO transactions (amount, category, notes, date) VALUES (?, ?, ?, ?)";
  db.query(insertQuery, [amount, category, notes, date], (err, result) => {
    if (err) {
      console.error("Error adding transaction:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Transaction added successfully" });
    }
  });
});

app.get("/transactions", (req, res) => {
  const selectQuery = "SELECT * FROM transactions";
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
