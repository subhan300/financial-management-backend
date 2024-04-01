const Router = require("express");
const { addExpense, getExpense } = require("../controller/expense.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const router = Router();
router.post("/add-expense", verifyJWT, addExpense);
router.get("/get-expense/:UserId", verifyJWT, getExpense);
module.exports = {
  router
};
