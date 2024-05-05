const Router = require("express");
const { addExpense, getExpense, editExpense, deleteExpense } = require("../controller/expense.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const router = Router();
router.post("/add-expense", verifyJWT, addExpense);
router.get("/get-expense/:UserId", verifyJWT, getExpense);
router.patch("/edit-expense/:UserId", verifyJWT, editExpense);
// router.get("/get-expense/:UserId", getExpense);
// router.patch("/edit-expense/:UserId", editExpense);
router.delete("/delete-expense/:date", verifyJWT, deleteExpense);
module.exports = {
  router
};
