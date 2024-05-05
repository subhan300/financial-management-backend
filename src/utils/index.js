const dayjs = require("dayjs");
const { Types } = require("mongoose");
function createObjectIdFromString(hexString) {
  return Types.ObjectId.createFromHexString(hexString);
}

function calculateMonthsToGoal(monthlyIncome, priceOfGoal, savingsPercentage, monthlyExpense) {
  const savedAmount = monthlyIncome - monthlyExpense;
  const totalMonthlySavings = (savedAmount * savingsPercentage) / 100;
  const monthsNeeded = Math.ceil(priceOfGoal / totalMonthlySavings);

  return {monthsNeeded,totalMonthlySavings}
}

const updateGoal=(goalModel,payload)=>{
  // const date="2024-04-14T00:00:00.000Z"
  // const newTotalExpenseValue=340
  // const newTotalIncomeValue=""
  const {date,newTotalExpenseValue,newTotalIncomeValue,UserId}=payload
  const dateFormat=dayjs(date).format("YYYY-MM-DD")
  console.log("newTotalIncomeValue",newTotalIncomeValue,"payload",payload,payload.date)
  // goalModel.findOneAndUpdate(
  //   { UserId, 'goalTracking.date': dateFormat, status: "notCompleted",},
   
  //   {
  //     $set: {
  //       'goalTracking.$.totalIncome': newTotalIncomeValue ? newTotalIncomeValue : undefined,
  //       'goalTracking.$.totalExpense': newTotalExpenseValue ? newTotalExpenseValue : undefined,
  //     }
  //   }
  // )
  //   .then((result) => {
  //     console.log("results goal===",result)
  //     if (!result) {
  //       throw new Error('Date not found in goalTracking array.');
  //     }
  //     console.log('Updated successfully');
  //   })
  //   .catch((error) => {
  //     console.error('Error updating goal:', error);
  //   });
  goalModel.findOneAndUpdate(
    { UserId, 'goalTracking.date': dateFormat, status: "notCompleted", },
    {
      $set: {
        'goalTracking.$.totalIncome': newTotalIncomeValue? newTotalIncomeValue : undefined,
        'goalTracking.$.totalExpense': newTotalExpenseValue? newTotalExpenseValue : undefined,
      }
    }
  )
  .then((result) => {
    console.log("results goal===", result)
    if (!result) {
      throw new Error('Date not found in goalTracking array.');
    }
    console.log('Updated successfully');
  
    // Get the correct goalTracking item based on date
    const goalTrackingItem = result.goalTracking.find(item => item.date === dateFormat);
  
    // Calculate monthsToGoal
    const monthlyIncome = newTotalIncomeValue? newTotalIncomeValue : goalTrackingItem.totalIncome;
    const priceOfGoal = parseFloat(result.price);
    const savingsPercentage = parseFloat(result.percentage);
    const monthlyExpense = newTotalExpenseValue? newTotalExpenseValue : goalTrackingItem.totalExpense;
    const monthsToGoal = calculateMonthsToGoal(monthlyIncome, priceOfGoal, savingsPercentage, monthlyExpense);
  
    // Update timeto_take and monthly_saving
    const updatedGoal = {
      timeto_take: monthsToGoal.monthsNeeded.toString(),
      monthly_saving: monthsToGoal.totalMonthlySavings.toString(),
    };
    return goalModel.findOneAndUpdate(
      { _id: result._id },
      { $set: updatedGoal },
      { new: true }
    );
  })
  .then((updatedGoal) => {
    console.log('Goal updated successfully:', updatedGoal);
  })
  .catch((error) => {
    console.error('Error updating goal:', error);
  });
}
module.exports = {
    createObjectIdFromString,
    updateGoal
};
