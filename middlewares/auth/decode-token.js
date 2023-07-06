const jwt = require("jsonwebtoken");
const config = require("../config/settings");

function decodeToken(token) {
  if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
  }
  return jwt.verify(token, config.jwt_secret);
}

module.exports = decodeToken;
