// server/config/db.js

require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Unable to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;
