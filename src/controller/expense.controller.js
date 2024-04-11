const Expense = require("../models/expense.modal");
const mongoose = require("mongoose");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const getExpense = async (req, res) => {
  const UserId = req.params.UserId; // Assuming userId is passed as a string
  try {
    const expenses = await Expense.find({ UserId });

    if (expenses.length === 0) {
      // If no records found, return an empty array
      return res.status(200).json(new ApiResponse(200, [], "No expenses found"));
    }

    // If records found, return the expenses
    return res.status(200).json(new ApiResponse(200, expenses, "Your Expenses"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while fetching expenses");
  }
};

const addExpense = async (req, res) => {
  const { monthly_rent, monthly_debts, debts_period, other_expense, UserId, total_expense } = req.body;
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
      UserId: String(UserId)
    });
    return res.status(201).json(new ApiResponse(200, expense, "Expense has been created"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
const editExpense = async (req, res) => {
  const UserId = req.params.UserId;
  const { monthly_rent, monthly_debts, debts_period, other_expense, total_expense } = req.body;
  try {
    if (!monthly_rent || !monthly_debts || !debts_period) {
      throw new ApiError(400, "Fields are required");
    }
    // Find the expense document by UserId and update it
    const expense = await Expense.findOneAndUpdate(
      { UserId: String(UserId) }, // Filter condition
      { monthly_rent, monthly_debts, debts_period, other_expense, total_expense }, // Update fields
      { new: true } // Return the updated document
    );
    if (!expense) {
      throw new ApiError(404, "Expense not found");
    }
    return res.status(200).json(new ApiResponse(200, expense, "Expense has been updated"));
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      return res.status(500).json(new ApiResponse(500, null, "Something went wrong while updating the expense"));
    }
  }
};
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters
    const result = await Expense.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({
        message: "Id not found!"
      });
    }
    res.status(200).send({
      message: "Expense has been deleted!"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Something went wrong!",
      error
    });
  }
};

module.exports = {
  addExpense,
  getExpense,
  editExpense,
  deleteExpense
};
