const {
  userSignUp,
  login,
  forgotPassword,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/signup", userSignUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

module.exports = router;
