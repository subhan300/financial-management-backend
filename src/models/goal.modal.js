const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const goalSchema = new Schema(
  {
    name: {
      type: String,
      required: true
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
      type: Date,
      required: true
    },
    timeto_take: {
      type: String,
      required: true
    },
    monthly_saving: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Goal", goalSchema);
