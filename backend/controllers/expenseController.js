const Expense = require("../models/Expense");

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    return res.status(201).json({ success: true, expenses: expenses });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

exports.addExpense = async (req, res, next) => {
  try {
    // const userId = req.session.user.id;
    // console.log(req.session);
    // if (!userId) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "unauthorized access" });
    // }
    const expense = await Expense.create({
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      userId: req.user.id,
    });
    if (!expense) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    }
    return res
      .status(201)
      .json({ sucess: true, message: "expense created successfully" });
  } catch (e) {
    return res.status(500).json({ success: false, message: `error :${e}` });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    await Expense.destroy({
      where: { id: req.params.expense_id, userId: req.user.id },
    });
    return res
      .status(201)
      .json({ success: true, message: "deleted successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong ${e}` });
  }
};
