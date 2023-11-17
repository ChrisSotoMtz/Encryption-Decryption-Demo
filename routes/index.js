var express = require('express');
var app = express.Router();
const path = require('path');
const crypto = require('crypto');
app.use(express.urlencoded({ extended: true }));

// Cipeher Parameters
const algorithm = 'aes-256-cbc';
const password = 'YourPassword';
const secretKey = crypto.scryptSync(password, 'salt', 32);
const iv = crypto.randomBytes(16);


// Encrypt and Decrypt Functions
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey,iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText) {
  if(encryptedText.length < 32 ) return  "Length of encrypted text is less than 32";
  const decipher = crypto.createDecipheriv(algorithm, secretKey,iv);;
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

app.get('/', (req, res) => {
  res.render('index');
});

// Encrypt and Decrypt Routes
app.post('/encrypt', (req, res) => {
  const originalText = req.body.text;
  const encryptedText = encrypt(originalText);
  res.render('index', { originalText, encryptedText });
});

app.post('/decrypt', (req, res) => {
  const encryptedText = req.body.text;
  const decryptedText = decrypt(encryptedText);
  res.render('index', { encryptedText, decryptedText });
});

module.exports = app;
