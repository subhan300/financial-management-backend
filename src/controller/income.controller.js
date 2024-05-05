const Income = require("../models/income.modal");
const Expense = require("../models/expense.modal");
const { ApiError } = require("../utils/ApiError");
const mongoose = require("mongoose");
const { ApiResponse } = require("../utils/ApiResponse");
const { Types } = require("mongoose");
const { updateGoal } = require("../utils");
const goalModal = require("../models/goal.modal");
const dayjs = require("dayjs");

function createObjectIdFromString(hexString) {
  return Types.ObjectId.createFromHexString(`${hexString}`);
}
const getIncome = async (req, res) => {
  const UserId = createObjectIdFromString(req.params.UserId);

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
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("user id=",UserId,"length===",UserId.length)
  const userId = createObjectIdFromString(UserId);
  try {
   
    if (monthly_income === "" || date === "") {
      return res.status(400).json({ message: "Field is required" });
    }
    const income = await Income.create({
      monthly_income,
      date,
      extra_income,
      total_income,
      UserId: userId
    },
    // {session}
  );
    const expense = await Expense.create({
      monthly_rent:"",
      monthly_debts:"",
      debts_period:"",
      other_expense:[],
      monthly_debts:"",
      debts_period:"",
      total_expense:0,
      UserId: userId,
      date,
      isExpenseUsable:true

    }
  // ]
    // ,{session}
  );
    console.log("date==",date)
    await session.commitTransaction();
    session.endSession(); // Release the session
    console.log("expesne===",expense)
    return res.status(201).json(new ApiResponse(200, income, "Income has been created"));
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession(); // Release the session
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};
const editIncome = async (req, res) => {
  const UserId = createObjectIdFromString(req.params.UserId);
  const { monthly_income, date, extra_income, total_income,incomeId} = req.body;
  console.log(req.body, "req.body");
  try {
    if (!monthly_income || !date || !extra_income || !total_income || !incomeId) {
      throw new ApiError(400, "Fields are required");
    }
    // Find the expense document by UserId and update it
    const expense = await Income.findOneAndUpdate(
      { UserId: UserId,_id:incomeId }, // Filter condition
      { monthly_income, date, extra_income, total_income }, // Update fields
      { new: true } // Return the updated document
    );
    const payload = { date, newTotalIncomeValue: total_income, newTotalExpenseValue: "" ,UserId};
    await updateGoal(goalModal, payload);
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

async function getDocumentWithLastDate(req, res) {
  try {
    console.log("req",req.query)
    const pipeline = [
      { $match: { UserId: createObjectIdFromString(req.query.userId) } }, // Match documents with the specified UserId
      { $sort: { 'date': -1 } }, // Sort documents by the date field in descending order
      { $limit: 1 } // Limit the result to only one document
  ];


    const result = await Income.aggregate(pipeline)
    console.log("result===", result);
    // return result[0]; // Return the document with the largest date
   await  res.status(200).json({date:result[0].date})
  } catch (error) {
    console.error("Error:", error);
    await  res.status(200).send(error)
  } finally {
  }
}

module.exports = {
  addIncome,
  getIncome,
  editIncome,
  deleteIncome,
  getDocumentWithLastDate
};
