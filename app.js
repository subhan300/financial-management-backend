const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware setup
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

// Enable CORS policy
app.use(cors());
app.options("*", cors());
app.use(cors());

// Custom middleware to set CORS headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
//routes import
const userRouter = require("./src/routes/user.route.js");
const incomeRouter = require("./src/routes/income.router.js");
const expenseRouter = require("./src/routes/expense.router.js");
const goalRouter = require("./src/routes/goal.router.js");
const generalRouter = require("./src/routes/general.router.js");
// Routes
app.use("/api/v1/users", userRouter.router);
app.use("/api/v1/income", incomeRouter.router);
app.use("/api/v1/expense", expenseRouter.router);
app.use("/api/v1/goal", goalRouter.router);
app.use("/api/v1/general", generalRouter.router);
module.exports = app;
