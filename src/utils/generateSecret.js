function generateRandomSecretKey(length = 32) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let secretKey = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    secretKey += characters[randomIndex];
  }
  return secretKey;
}
module.exports = {
  generateRandomSecretKey
};
