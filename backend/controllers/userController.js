const generateToken = require("../middleware/authGenerate");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SDK_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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
      const token = generateToken({
        id: user.id,
        username: user.username,
        isPremium: user.isPremium,
      });
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

    const token = generateToken({
      id: user.id,
      username: user.username,
      isPremium: user.isPremium,
    });
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

exports.forgotPassword = async (req, res, next) => {
  console.log(req.body.mail);
  const sendSmtpEmail = {
    to: [
      {
        email: "abdul7to7@gmail.com",
        // email: req.body.mail,
        // name: 'User Name' // Optionally, you can add a name
      },
    ],
    sender: {
      email: "abdul7to7@gmail.com",
      name: "Expense_Demo",
    },
    subject: "Password Reset Request",
    htmlContent: `
      <html>
      <body>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="/">Reset Password</a>
      </body>
      </html>`,
  };

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
