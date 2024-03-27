const crypto = require("crypto");
const generateRandomSecret = () => {
  return crypto.randomBytes(64).toString("base64");
};
module.exports = {
  generateRandomSecret
};
