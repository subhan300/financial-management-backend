const expenseModal = require("../models/expense.modal");
const goalModal = require("../models/goal.modal");
const incomeModal = require("../models/income.modal");
const userModel = require("../models/user.model");

const deleteDatabase = async (req, res) => {
    try {
        // Delete all documents from the expense collection
        await expenseModal.deleteMany({});
        
        // Delete all documents from the goal collection
        await goalModal.deleteMany({});
        
        // Delete all documents from the income collection
        await incomeModal.deleteMany({});
        
        // Delete all documents from the user collection
        await userModel.deleteMany({});
    
        res.status(200).send({
            message: "All models have been deleted!",
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
    deleteDatabase
};
