const Goal = require("../models/goal.modal");
const { ApiError } = require("../utils/ApiError");
const mongoose = require("mongoose");
const { ApiResponse } = require("../utils/ApiResponse");
const { json } = require("body-parser");
const getMonthlyGoal = async (req, res) => {
  const UserId = req.params.UserId;
  try {
    const goal = await Goal.find({ UserId });
    return res.status(200).json(new ApiResponse(200, goal, "monthly goal"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
const addGoal = async (req, res) => {
  const { name, price, percentage, timeto_take, UserId, monthly_saving } = req.body;
  try {
    if (name === "" || price === "" || percentage === "" || UserId === "" || monthly_saving === "") {
      return res.status(400).json(
        json({
          message: "fields are required"
        })
      );
    }
    const goal = await Goal.create({
      name,
      price,
      percentage,
      timeto_take,
      UserId,
      monthly_saving
    });
    return res.status(201).json(new ApiResponse(200, goal, "Goal has been saved"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
const editGoal = async (req, res) => {
  const UserId = req.params.UserId;
  const { name, price, percentage, monthly_saving } = req.body;
  try {
    if (name === "" || price === "" || percentage === "" || monthly_saving === "") {
      throw new ApiError(400, "fields are required");
    }
    // Find the expense document by UserId and update it
    const goal = await Goal.findOneAndUpdate(
      { UserId: UserId }, // Filter condition
      { name, price, percentage, monthly_saving }, // Update fields
      { new: true } // Return the updated document
    );
    if (!goal) {
      throw new ApiError(404, "Id not found");
    }
    return res.status(200).json(new ApiResponse(200, goal, "Goal has been updated"));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res.status(500).json(new ApiResponse(500, null, "Something went wrong while updating the expense"));
    }
  }
};
module.exports = {
  addGoal,
  getMonthlyGoal,
  editGoal
};
