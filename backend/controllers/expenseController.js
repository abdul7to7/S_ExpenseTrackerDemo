const Expense = require("../models/Expense");

exports.addExpense = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    console.log(req.session);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized access" });
    }
    const expense = await Expense.create({
      amount: req.body.amount,
      desciption: req.body.desciption,
      category: req.body.category,
      userId: userId,
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
