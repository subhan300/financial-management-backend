const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const expenseSchema = new Schema(
  {
    monthly_rent: {
      type: String,
      required: true
    },
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    monthly_debts: {
      type: String,
      required: true
    },
    debts_period: {
      type: String,
      required: true
    },
    total_expense: {
      type: String,
      required: true
    },
    other_expense: [
      {
        expense_name: {
          type: String,
          required: true
        },
        price: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Expense", expenseSchema);
