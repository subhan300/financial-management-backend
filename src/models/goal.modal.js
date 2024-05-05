const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    haveNotified:{
      type:Boolean,
      required:false
    },
    price: {
      type: String,
      required: true
    },
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    percentage: {
      type: String,
      required: true
    },
    timeto_take: {
      type: String,
      required: true
    },
    monthly_saving: {
      type: String,
      required: true
    },
    goalTracking: [
      {
        totalIncome: { type: Number, required: true },
        totalExpense: { type: Number, required: true },
        date: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Goal", goalSchema);
