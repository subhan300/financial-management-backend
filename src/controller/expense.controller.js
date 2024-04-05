const Expense = require("../models/expense.modal");
const mongoose = require("mongoose");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const getExpense = async (req, res) => {
  const UserId = req.params.UserId; // Assuming userId is passed as a string
  try {
    const expense = await Expense.find({ UserId });
    if (!expense) {
      return res.status(404).json({ message: "User does not exists" });
    }
    console.log(expense);
    return res.status(200).json(new ApiResponse(200, expense, "Your Expense"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
const addExpense = async (req, res) => {
  const { monthly_rent, monthly_debts, debts_period, other_expense, total_expense, UserId, fixed_expense } = req.body;
  console.log(monthly_rent, monthly_debts, debts_period, "monthly_rent, monthly_debts, debts_period");
  try {
    if (monthly_rent === "" || monthly_rent === "" || debts_period === "") {
      throw new ApiError(400, "fields are required");
    }
    const expense = await Expense.create({
      monthly_rent,
      monthly_debts,
      debts_period,
      other_expense,
      total_expense,
      fixed_expense,
      UserId
    });
    return res.status(201).json(new ApiResponse(200, expense, "Expense has been created"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
module.exports = {
  addExpense,
  getExpense
};
