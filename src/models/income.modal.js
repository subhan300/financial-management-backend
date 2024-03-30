const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const incomeSchema = new Schema(
  {
    monthly_income: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    extra_income: [
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
module.exports = mongoose.model("Income", incomeSchema);
