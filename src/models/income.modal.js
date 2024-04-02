const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const incomeSchema = new Schema(
  {
    monthly_income: {
      type: String,
      required: true
    },
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    date: {
      type: Date,
      required: true
    },
    total_income: {
      type: String,
      required: true
    },
    extra_income: [
      {
        income_name: {
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
