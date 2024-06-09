const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'user'
});

// Register user
app.post('/register', (req, res) => {
  const { name, phoneNumber, email, city, country, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000);
  db.query(`INSERT INTO users (name, phone_number, email, city, country, password, otp) VALUES (?, ?, ?, ?, ?, ?, ?)`, [name, phoneNumber, email, city, country, hashedPassword, otp], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error registering user' });
    } else {
      res.send({ message: 'User registered successfully', otp });
    }
  });
});

// Verify user
app.post('/verify', (req, res) => {
  const { email, otp } = req.body;
  db.query(`SELECT * FROM users WHERE email = ? AND otp = ?`, [email, otp], (err, results) => {
    if (err || results.length === 0) {
      res.status(401).send({ message: 'Invalid OTP' });
    } else {
      res.send({ message: 'User verified successfully' });
    }
  });
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, results) => {
    if (err || results.length === 0) {
      res.status(401).send({ message: 'Invalid credentials' });
    } else {
      const user = results[0];
      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.send({ token, user: { id: user.id, name: user.name, email: user.email } });
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    }
  });
});

// Add contact
app.post('/contact', (req, res) => {
  const { name, phoneNumber } = req.body;
  const userId = req.user.id;
  db.query(`INSERT INTO contacts (user_id, name, phone_number) VALUES (?, ?, ?)`, [userId, name, phoneNumber], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error adding contact' });
    } else {
      res.send({ message: 'Contact added successfully' });
    }
  });
});

// Get contacts
app.get('/contact', (req, res) => {
  const userId = req.user.id;
  db.query(`SELECT * FROM contacts WHERE user_id = ?`, [userId], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error getting contacts' });
    } else {
      res.send(results);
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});