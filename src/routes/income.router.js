const Router = require("express");
const { addIncome, getIncome, editIncome, deleteIncome, getDocumentWithLastDate } = require("../controller/income.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const router = Router();
router.post("/add-income", verifyJWT, addIncome);
router.get("/get-income/:UserId", verifyJWT, getIncome);
router.patch("/edit-income/:UserId", verifyJWT, editIncome);
router.delete("/delete-income/:id", verifyJWT, deleteIncome);
router.get("/getLastDate",getDocumentWithLastDate)
module.exports = {
  router
};
