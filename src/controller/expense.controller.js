const Expense = require("../models/expense.modal");
const Goal = require("../models/goal.modal");
const mongoose = require("mongoose");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { createObjectIdFromString, updateGoal } = require("../utils");
const getExpense = async (req, res) => {
  const UserId = createObjectIdFromString(req.params.UserId);
  try {
    const expenses = await Expense.find({ UserId });
    if (expenses.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No expenses found"));
    }

    return res.status(200).json(new ApiResponse(200, expenses, "Your Expenses"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while fetching expenses");
  }
};

const addExpense = async (req, res) => {
  const { monthly_rent, monthly_debts, debts_period, other_expense, UserId, total_expense, date, isExpenseUsable } =
    req.body;
  const userId = createObjectIdFromString(UserId);
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
      UserId: userId,
      date,
      isExpenseUsable
    });
    return res.status(201).json(new ApiResponse(200, expense, "Expense has been created"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
const editExpense = async (req, res) => {
  const UserId = createObjectIdFromString(req.params?.UserId ? req.params?.UserId: req.body. UserId);
  const { monthly_rent, monthly_debts, debts_period, other_expense, total_expense, isExpenseUsable, expenseId } = req.body;

  try {
    if (!monthly_rent || !monthly_debts || !debts_period) {
      throw new ApiError(400, "Fields are required");
    }

    let expense;
    if (expenseId) {
      // Update expense by ID and user ID
      expense = await Expense.findOneAndUpdate(
        { _id: expenseId, UserId },
        { monthly_rent, monthly_debts, debts_period, other_expense, total_expense, },
        { new: true }
      );
    } else {
      // Find expense by user ID with latest date
      const existingExpenses = await Expense.find({ UserId }, null, { sort: { date: -1 }, limit: 1 });
      expense = existingExpenses[0]; // Get the first document (latest date)

      // Update the expense fields with values from the request body
      expense.monthly_rent = monthly_rent;
      expense.monthly_debts = monthly_debts;
      expense.debts_period = debts_period;
      expense.other_expense = other_expense;
      expense.total_expense = total_expense;
      expense.isExpenseUsable = isExpenseUsable;

      // Save the updated expense
      await expense.save();
    }

    // Update the goal if expense is updated successfully
    const payload = { date: expense.date, newTotalExpenseValue: total_expense, newTotalIncomeValue: "" ,UserId};
    await updateGoal(Goal, payload);

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

// const editExpense = async (req, res) => {
//   const UserId = createObjectIdFromString(req.params.UserId);
//   const { monthly_rent, monthly_debts, debts_period, other_expense, total_expense, isExpenseUsable ,expenseId} = req.body;
//   console.log("date",date,"total=",total_expense)
//   try {
//     if (!monthly_rent || !monthly_debts || !debts_period) {
//       throw new ApiError(400, "Fields are required");
//     }
//     // Find the expense document by UserId and update it

//     // const expense = await Expense.findOneAndUpdate(
//     //   { UserId: UserId ,isExpenseUsable:true}, // Filter condition
//     //   { monthly_rent, monthly_debts, debts_period, other_expense, total_expense,isExpenseUsable }, // Update fields
//     //   { new: true } // Return the updated document
//     // );
//     let expense;
//     if (expenseId) {
//       // Update expense by ID and user ID
//       expense = await Expense.findOneAndUpdate(
//         { _id: expenseId, UserId }, // Match by ID and user
//         { monthly_rent, monthly_debts, debts_period, other_expense, total_expense, isExpenseUsable },
//         { new: true } // Return the updated document
//       );
//     } else {
//       // Find expense by user ID with latest date
//       const existingExpenses = await Expense.find({ UserId }, null, { sort: { date: -1 }, limit: 1 });
//       expense = existingExpenses[0]; // Get the first document (latest date)
//     }
//     const payload = { date, newTotalExpenseValue: total_expense, newTotalIncomeValue: "" };
//     await updateGoal(Goal, payload);

//     if (!expense) {
//       throw new ApiError(404, "Expense not found");
//     }
//     return res.status(200).json(new ApiResponse(200, expense, "Expense has been updated"));
//   } catch (error) {
//     console.error(error);
//     if (error instanceof ApiError) {
//       return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
//     } else {
//       return res.status(500).json(new ApiResponse(500, null, "Something went wrong while updating the expense"));
//     }
//   }
// };
// const deleteExpense = async (req, res) => {
//   try {
//     const { id } = req.params; // Get the product ID from the request parameters
//     const result = await Expense.findByIdAndDelete(date);
//     if (!result) {
//       return res.status(404).send({
//         message: "Id not found!"
//       });
//     }
//     res.status(200).send({
//       message: "Expense has been deleted!"
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Something went wrong!",
//       error
//     });
//   }
// };
const deleteExpense = async (req, res) => {
  try {
    const { date } = req.params; // Get the expense date from the request parameters
    console.log("date==",date)
    const result = await Expense.findOneAndDelete({ date}); // Find and delete the expense with the given date and user ID
    if (!result) {
      return res.status(404).send({
        message: "Expense not found!"
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
