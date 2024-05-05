const Router = require("express");

const { deleteDatabase } = require("../controller/general.controller.js");
const router = Router();

router.delete("/delete-databse/",deleteDatabase);
module.exports = {
  router
};
