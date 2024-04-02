const Goal = require("../models/goal.modal");
const { ApiError } = require("../utils/ApiError");
const mongoose = require("mongoose");
const { ApiResponse } = require("../utils/ApiResponse");
const addGoal = async (req, res) => {
  const { name, price, percentage, timeto_take, UserId } = req.body;
  try {
    if (name === "" || price === "" || percentage === "" || UserId === "") {
      throw new ApiError(400, "fields are required");
    }
    const goal = await Goal.create({
      name,
      price,
      percentage,
      timeto_take,
      UserId
    });
    return res.status(201).json(new ApiResponse(200, goal, "Goal has been saved"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
module.exports = {
  addGoal
};
