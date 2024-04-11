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
  forgetPasswordEmail
} = require("../controller/user.controller.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const verifyJWT = require("../middleware/auth.middleware.js");
const router = Router();
<<<<<<< HEAD
router.post("/register", registerUser);
=======
router.post("/register", upload.single("avatar"), registerUser);
>>>>>>> c204e05ecf63f3def47fca1adba2eb250bad76c9
router.route("/login").post(loginUser);
router.route("/email-verify/:token").get(verifyEmail);
router.route("/forget-password").post(forgetPasswordEmail);
//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password/:token").post(changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account/:id").patch(updateAccountDetails);
module.exports = {
  router
};
