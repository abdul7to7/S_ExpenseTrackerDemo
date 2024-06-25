const jwt = require("jsonwebtoken");
function authenticate(req, res, next) {
  const token = req.headers.token;
  if (!token) return res.status(403).json({});
  jwt.verify(token, "secret_key", (err, result) => {
    req.user = result;
    next();
  });
}

module.exports = authenticate;
