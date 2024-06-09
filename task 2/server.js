
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'global_database'
};

const db = mysql.createPool(dbConfig);

// Create global database tables
app.get('/create_tables', async (req, res) => {
  const createUserTable = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    phone_number VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
  )`;

  const createContactsTable = `CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`;

  const createSpamTable = `CREATE TABLE IF NOT EXISTS spam (
    id INT AUTO_INCREMENT,
    phone_number VARCHAR(20) NOT NULL,
    spam_likelihood INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
  )`;

  try {
    await db.execute(createUserTable);
    await db.execute(createContactsTable);
    await db.execute(createSpamTable);
    res.send('Tables created successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating tables.');
  }
});

// Add user to global database
app.post('/add_user', async (req, res) => {
  const { phone_number, name, email, city, country } = req.body;
  const query = `INSERT INTO users (phone_number, name, email, city, country) VALUES (?,?,?,?,?)`;
  try {
    await db.execute(query, [phone_number, name, email, city, country]);
    res.send('User added successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding user.');
  }
});

// Add contact to global database
app.post('/add_contact', async (req, res) => {
  const { user_id, phone_number, name } = req.body;
  const query = `INSERT INTO contacts (user_id, phone_number, name) VALUES (?,?,?)`;
  try {
    await db.execute(query, [user_id, phone_number, name]);
    res.send('Contact added successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding contact.');
  }
});

// Mark number as spam
app.post('/mark_spam', async (req, res) => {
  const { phone_number } = req.body;
  const query = `INSERT INTO spam (phone_number) VALUES (?) ON DUPLICATE KEY UPDATE spam_likelihood = spam_likelihood + 1`;
  try {
    await db.execute(query, [phone_number]);
    res.send('Number marked as spam successfully.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error marking number as spam.');
  }
});

// Get spam likelihood of a number
app.get('/get_spam_likelihood', async (req, res) => {
  const { phone_number } = req.query;
  const query = `SELECT spam_likelihood FROM spam WHERE phone_number = ?`;
  try {
    const [rows] = await db.execute(query, [phone_number]);
    if (rows.length === 0) {
      res.send({ spam_likelihood: 0 });
    } else {
      res.send({ spam_likelihood: rows[0].spam_likelihood });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting spam likelihood.');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});