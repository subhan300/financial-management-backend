const dotenv = require("dotenv");
const { connectDB } = require("./src/db");
const app = require("./app");
dotenv.config();
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3977, () => {
      console.log(`⚙️ Server is running at port : 3977`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
