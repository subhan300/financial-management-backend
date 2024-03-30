const Income = require("../models/income.modal");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const addIncome = async (req, res) => {
  const { monthly_income, date, extra_income } = req.body;
  try {
    if ([monthly_income, date].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "fields are required");
    }
    const income = await Income.create({
      monthly_income,
      date,
      extra_income
    });
    return res.status(201).json(new ApiResponse(200, income, "Income has been created"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
module.exports = {
  addIncome
};
