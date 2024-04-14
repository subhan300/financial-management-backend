const Router = require("express");
const {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateAccountDetails,
  verifyEmail,
  forgetPasswordEmail,
  sendMail
} = require("../controller/user.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const router = Router();
router.post("/register", registerUser);
router.route("/login").post(loginUser);
router.route("/email-verify/:token").get(verifyEmail);
router.route("/forget-password").post(forgetPasswordEmail);
//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password/:token").post(changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account/:id").patch(updateAccountDetails);
router.route("/send-email").post(sendMail);
module.exports = {
  router
};
