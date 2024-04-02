const Income = require("../models/income.modal");
const { ApiError } = require("../utils/ApiError");
const mongoose = require("mongoose");
const { ApiResponse } = require("../utils/ApiResponse");
const getIncome = async (req, res) => {
  const UserId = req.params.UserId;
  try {
    const income = await Income.findOne({ UserId });
    if (!income) {
      return res.status(404).json({ message: "User does not exists" });
    }
    return res.status(200).json(new ApiResponse(200, income, "Your income"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};

const addIncome = async (req, res) => {
  const { monthly_income, date, extra_income, total_income, UserId } = req.body;
  try {
    if (monthly_income === "" || date === "") {
      return res.status(400).json({ message: "Field is required" });
    }
    const income = await Income.create({
      monthly_income,
      date,
      extra_income,
      total_income,
      UserId
    });
    return res.status(201).json(new ApiResponse(200, income, "Income has been created"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
module.exports = {
  addIncome,
  getIncome
};
