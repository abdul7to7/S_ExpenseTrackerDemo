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
      req.session.user = {
        id: user.id,
      };
      return (
        res
          // .redirect("/expenseForm.html");
          .status(201)
          .json({ success: true, message: "user succesfully created" })
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
      return res.status(401).json({ message: "password not matched" });
    }
    req.session.user = {
      id: user.id,
    };

    return (
      res
        // .status(302)
        // .redirect("/expenseForm.html");
        .status(201)
        .json({ success: true, user: user })
    );
  } catch (e) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};
