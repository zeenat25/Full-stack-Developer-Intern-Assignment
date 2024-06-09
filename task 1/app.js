import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [contacts, setContacts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get('/api/contacts')
        .then(response => {
          setContacts(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [isLoggedIn]);

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/register', {
        name,
        phoneNumber,
        email,
        city,
        country,
        password
      });
      setOtp(response.data.otp);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post('/api/verify', {
        email,
        otp
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', {
        email,
        password
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddContact = async () => {
    try {
      const response = await axios.post('/api/contact', {
        name: 'New Contact',
        phoneNumber: '1234567890'
      });
      setContacts([...contacts, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Personal Contacts</h1>
          <ul>
            {contacts.map(contact => (
              <li key={contact.id}>{contact.name} - {contact.phoneNumber}</li>
            ))}
          </ul>
          <button onClick={handleAddContact}>Add Contact</button>
        </div>
      ) : (
        <div>
          <h1>Register</h1>
          <form>
            <label>Name:</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <br />
            <label>Phone Number:</label>
            <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            <br />
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <br />
            <label>City:</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} />
            <br />
            <label>Country:</label>
            <input type="text" value={country} onChange={e => setCountry(e.target.value)} />
            <br />
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <br />
            <button onClick={handleRegister}>Register</button>
          </form>
          <h1>Verify</h1>
          <form>
            <label>OTP:</label>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} />
            <br />
            <button onClick={handleVerify}>Verify</button>
          </form>
          <h1>Login</h1>
          <form>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <br />
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <br />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
