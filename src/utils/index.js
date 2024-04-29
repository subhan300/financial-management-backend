const { Types } = require("mongoose");
function createObjectIdFromString(hexString) {
  return Types.ObjectId.createFromHexString(hexString);
}


const updateGoal=(goalModel,payload)=>{
  // const date="2024-04-14T00:00:00.000Z"
  // const newTotalExpenseValue=340
  // const newTotalIncomeValue=""
  const {date,newTotalExpenseValue,newTotalIncomeValue,UserId}=payload
  goalModel.findOneAndUpdate(
    { UserId, 'goalTracking.date': date , status: "inComplete",},
    {
      $set: {
        'goalTracking.$.totalIncome': newTotalIncomeValue ? newTotalIncomeValue : undefined,
        'goalTracking.$.totalExpense': newTotalExpenseValue ? newTotalExpenseValue : undefined,
      }
    }
  )
    .then((result) => {
      console.log("results===",result)
      if (!result) {
        throw new Error('Date not found in goalTracking array.');
      }
      console.log('Updated successfully');
    })
    .catch((error) => {
      console.error('Error updating goal:', error);
    });
}
module.exports = {
    createObjectIdFromString,
    updateGoal
};
