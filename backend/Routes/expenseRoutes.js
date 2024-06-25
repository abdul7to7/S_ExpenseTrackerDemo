const { addExpense } = require("../controllers/expenseController");

const router = require("express").Router();

router.post("/add_expense", addExpense);

module.exports = router;
