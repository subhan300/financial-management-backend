const Router = require("express");
const verifyJWT = require("../middleware/auth.middleware.js");
const { addGoal, getMonthlyGoal, editGoal } = require("../controller/goal.controller.js");
const router = Router();
router.get("/get-goal/:UserId", verifyJWT, getMonthlyGoal);
router.post("/add-goal", verifyJWT, addGoal);
router.patch("/edit-goal/:UserId", verifyJWT, editGoal);
module.exports = {
  router
};
