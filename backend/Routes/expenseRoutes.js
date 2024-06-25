const {
  addExpense,
  deleteExpense,
  getAllExpenses,
} = require("../controllers/expenseController");

const router = require("express").Router();

router.post("/add_expense", addExpense);
router.get("/delete_expense/:expense_id", deleteExpense);
router.get("/get_expenses", getAllExpenses);

module.exports = router;
