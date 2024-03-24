const express = require("express");
const router = express.Router();
const notification = require("../controller/pushnotification.controller");
router.post("/sendnotification/0ea7cc/:deviceId", notification.sendNotification);
module.exports = router;
