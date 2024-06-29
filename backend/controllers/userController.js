const generateToken = require("../middleware/authGenerate");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.userSignUp = async (req, res, next) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    if (!hashed) {
      return res.status(500).json(err);
    }
    const user = await User.create({
      username: req.body.username,
      mail: req.body.mail,
      password: hashed,
    });
    if (user) {
      const token = generateToken({ id: user.id, username: user.username });
      return (
        res
          // .redirect("/expenseForm.html");
          .status(201)
          .json({
            success: true,
            message: "user succesfully created",
            token: token,
          })
      );
    } else {
      return res
        .status(500)
        .json({ success: false, message: "register failed" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { mail: req.body.mail } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "password not matched" });
    }

    const token = generateToken({ id: user.id, username: user.username });
    return (
      res
        // .status(302)
        // .redirect("/expenseForm.html");
        .status(201)
        .json({ success: true, token: token })
    );
  } catch (e) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};
