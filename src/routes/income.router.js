const Router = require("express");
const { addIncome, getIncome } = require("../controller/income.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const router = Router();
router.post("/add-income", verifyJWT, addIncome);
router.get("/get-income/:UserId", verifyJWT, getIncome);
module.exports = {
  router
};
