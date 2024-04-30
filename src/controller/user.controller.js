const User = require("../models/user.model.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { sendEmail } = require("../utils/SendMail.js");
const { generateRandomSecretKey } = require("../utils/generateSecret.js");
const { uploadOnCloudinary } = require("../utils/fileuploader.js");
const { ApiError } = require("../utils/ApiError.js");
const { default: axios } = require("axios");

const generateAccessAndRefereshTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Optionally, you can save the refresh token to the user document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email, "email");
  const token = generateRandomSecretKey();
  const avatarLocalPath = req.file?.path;
  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });
  if (existedUser) {
    res.status(409).json({ message: "User with email or username already exists" });
  }
  const upload = await uploadOnCloudinary(avatarLocalPath);
  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
    avatar: upload?.url,
    verificationToken: token
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  let mailOptions = {
    from: "iamierlusmazilu@gmail.com",
    to: email,
    subject: "Email confirmation",
    html: `Press <a href="https://financial-frotnend.vercel.app/verify-email/${token}">Click here</a> to verify your email. Thanks!`
  };
  sendEmail(mailOptions);
  res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User does not exist" }); // return added here
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" }); // return added here
  }

  if (user.isVerified === false) {
    return res.status(403).json({ message: "Please verify your email first" }); // return added here
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  };

 return  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1 // this removes the field from document
      }
    },
    {
      new: true
    }
  );

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true
    };

    const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  console.log(req.params.token, "req.params.token");
  const user = await User.findOne({
    verificationToken: req.params.token
  }).select("-password");
  if (!user) {
    res.status(404).json({ message: "user does not exists" });
  }
  user.password = password;
  user.verificationToken = undefined; // Clear the verification token
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: username,
        email: email
      }
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Avatar image updated successfully"));
});
const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const token = decodeURIComponent(req.params.token);
    console.log(token);
    // Find the user with the provided verification token
    const user = await User.findOne({ verificationToken: token });
    console.log(user, "user======");
    if (user === null) {
      throw new ApiError(404, "Invalid token");
    }
    if (user) {
      // If user found, update the isVerified field to true
      user.isVerified = true; // Corrected typo here
      user.verificationToken = undefined; // Clear the verification token
      await user.save();
      // Redirect or respond with a success message
      res.status(200).json(new ApiResponse(200, "Email verified successfully"));
    }
  } catch (error) {
    // Handle any errors
    console.error("Error verifying email:", error);
    throw new ApiError(500, "Something went wrong");
  }
});
const forgetPasswordEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const token = generateRandomSecretKey();
  if (!email) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({ email: email }).select("-password");
  if (!user) {
    res.status(404).json({ message: "user does not exists" });
  }
  user.verificationToken = token;
  await user.save({ validateBeforeSave: false });
  let mailOptions = {
    from: "hasnainaskari32@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `Press <a href="https://financial-frotnend.vercel.app/resetpassword/${token}">Click here</a> to reset your password. Thanks!`
  };
  sendEmail(mailOptions);
  return res.status(201).json(new ApiResponse(200, "Email has been sent"));
});
const sendMail = asyncHandler(async (req, res) => {
  try {
    // Extract email data from the request body
    const { to, from, subject, text } = req.body;

    // SendGrid API key
    const SENDGRID_API_KEY =process.env.SENDGRID_API_KEY;

    // SendGrid email payload
    const emailData = {
      personalizations: [{ to: [{ email: to }], subject }],
      from: { email: from },
      content: [{ type: "text/plain", value: text }]
    };

    // Send email using SendGrid API
    const response = await axios.post("https://api.sendgrid.com/v3/mail/send", emailData, {
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    // Email sent successfully
    console.log("Email sent:", response.data);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    // Error sending email
    console.error("Error sending email:", error.response.data);
    res.status(500).send("Error sending email");
  }
});

module.exports = {
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
};
