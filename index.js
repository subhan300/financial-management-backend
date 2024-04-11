"use strict";
const dotenv = require("dotenv");
const { connectDB } = require("./src/db");
const app = require("./app.js");
dotenv.config();
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : 8000`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
