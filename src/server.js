var bodyParser = require("body-parser");
var express = require("express");
var cors = require("cors");

var connectDB = require("../config/database");
var auth = require("./routes/api/auth");
var user = require("./routes/api/user");
var contact = require("./routes/api/contact");

const app = express();

// Connect to MongoDB
connectDB();

// CORS
app.use(cors());

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/contact", contact);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

module.exports = server;
