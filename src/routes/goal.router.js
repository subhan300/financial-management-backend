const Router = require("express");
const { addExpense, getExpense } = require("../controller/expense.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const { addGoal } = require("../controller/goal.controller.js");
const router = Router();
router.post("/add-goal", verifyJWT, addGoal);
module.exports = {
  router
};
