const crypto = require("crypto");

function generateHash(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function verifySignature(review, signature, publicKey) {
  const verify = crypto.createVerify("SHA256");
  verify.update(review);
  verify.end();
  return verify.verify(publicKey, signature, "hex");
}

module.exports = { generateHash, verifySignature };
