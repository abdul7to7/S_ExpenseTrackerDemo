const { userSignUp } = require("../controllers/userController");

const router = require("express").Router();

router.post("/signup", userSignUp);

module.exports = router;
