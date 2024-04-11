const Income = require("../models/income.modal");
const { ApiError } = require("../utils/ApiError");
const mongoose = require("mongoose");
const { ApiResponse } = require("../utils/ApiResponse");

const getIncome = async (req, res) => {
  const UserId = req.params.UserId;
  console.log(typeof UserId);
  try {
    const income = await Income.find({ UserId });
    if (income.length === 0) {
      // If no records found, return an empty array
      return res.status(200).json(new ApiResponse(200, [], "No expenses found"));
    }
    return res.status(200).json(new ApiResponse(200, income, "Your income"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while fetching expenses");
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
      UserId: String(UserId)
    });
    return res.status(201).json(new ApiResponse(200, income, "Income has been created"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
const editIncome = async (req, res) => {
  const UserId = req.params.UserId;
  const { monthly_income, date, extra_income, total_income } = req.body;
  console.log(req.body, "req.body");
  try {
    if (!monthly_income || !date || !extra_income || !total_income) {
      throw new ApiError(400, "Fields are required");
    }
    // Find the expense document by UserId and update it
    const expense = await Income.findOneAndUpdate(
      { UserId: UserId }, // Filter condition
      { monthly_income, date, extra_income, total_income }, // Update fields
      { new: true } // Return the updated document
    );
    console.log(expense, "expense======");
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
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters
    const result = await Income.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({
        message: "Id not found!"
      });
    }
    res.status(200).send({
      message: "Income has been deleted!",
      result: []
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
  addIncome,
  getIncome,
  editIncome,
  deleteIncome
};
