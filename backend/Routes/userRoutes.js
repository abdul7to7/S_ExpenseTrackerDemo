const { userSignUp, login } = require("../controllers/userController");

const router = require("express").Router();

router.post("/signup", userSignUp);
router.post("/login", login);

module.exports = router;
