const mongoose = require("mongoose");
const dotenv = require("dotenv");
const URL = "mongodb+srv://hasnainaskari32:x43epzOYSZBa5Wvq@cluster0.nbvkq2z.mongodb.net/";
// const URL = "mongodb://0.0.0.0:27017/financeapp_db";
dotenv.config();
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(URL);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

module.exports = {
  connectDB
};
