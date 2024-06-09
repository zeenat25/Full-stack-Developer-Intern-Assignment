const express = require('express');
const mysql = require('mysql');
const app = express();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'user'
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// search by name
const searchByName = (name) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM people WHERE name LIKE '%${name}%' OR name LIKE '${name}%'`;
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// search by phone number
const searchByPhone = (phone) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM people WHERE phone = '${phone}'`;
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// get person details
const getPersonDetails = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM people WHERE id = '${id}'`;
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

// calculate spam likelihood (dummy implementation)
const calculateSpamLikelihood = () => {
  return Math.random() * 100;
};

// check if user is in contact list
const checkIfInContactList = async (userId, personId) => {
  const query = `SELECT * FROM contact_list WHERE user_id = ${userId} AND person_id = ${personId}`;
  const result = await db.query(query);
  return result.length > 0;
};

app.get('/api/search/name/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const results = await searchByName(name);
    const resultsWithSpamLikelihood = results.map((result) => {
      result.spamLikelihood = calculateSpamLikelihood();
      return result;
    });
    res.send(resultsWithSpamLikelihood);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error searching by name' });
  }
});

app.get('/api/search/phone/:phone', async (req, res) => {
  const phone = req.params.phone;
  try {
    const results = await searchByPhone(phone);
    const resultsWithSpamLikelihood = results.map((result) => {
      result.spamLikelihood = calculateSpamLikelihood();
      return result;
    });
    res.send(resultsWithSpamLikelihood);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error searching by phone' });
  }
});

app.get('/api/person/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const person = await getPersonDetails(id);
    const isRegisteredUser = person.email!== null;
    const isInContactList = await checkIfInContactList(req.user.id, person.id);
    if (isRegisteredUser && isInContactList) {
      person.email = 'example@example.com'; // dummy email
    } else {
      person.email = null;
    }
    res.send(person);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error getting person details' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});