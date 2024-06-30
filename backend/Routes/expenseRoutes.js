const {
  addExpense,
  deleteExpense,
  getAllExpenses,
  getLeaderboard,
} = require("../controllers/expenseController");

const router = require("express").Router();

router.post("/add_expense", addExpense);
router.get("/delete_expense/:expense_id", deleteExpense);
router.get("/get_expenses", getAllExpenses);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
