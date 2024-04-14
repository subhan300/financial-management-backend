const Router = require("express");
const verifyJWT = require("../middleware/auth.middleware.js");
const { addGoal, getMonthlyGoal, editGoal, deleteGoal } = require("../controller/goal.controller.js");
const router = Router();
router.get("/get-goal/:UserId", verifyJWT, getMonthlyGoal);
router.post("/add-goal", verifyJWT, addGoal);
router.patch("/edit-goal/:UserId", verifyJWT, editGoal);
router.delete("/delete-goal/:id", verifyJWT, deleteGoal);
module.exports = {
  router
};
