const Router = require("express");
const { addIncome } = require("../controller/income.controller.js");
const router = Router();
router.post("/add-income", addIncome);
module.exports = {
  router
};
