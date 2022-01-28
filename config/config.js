const env = process.env.NODE_ENV; // 'dev' or 'test'

var dotenv = require("dotenv");

dotenv.config();

const config = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || "jwtSecretToken",
  jwtExpiration: parseInt(process.env.JWT_EXPIRATION || "360000"),
};

module.exports = config;

