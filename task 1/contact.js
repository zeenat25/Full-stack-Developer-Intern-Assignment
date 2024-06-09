// Contact.js
import React, { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAddContact = async () => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber }),
      });
      const data = await response.json();
      setContacts([...contacts, data]);
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
            {contacts.map((contact, index) => (
              <li key={index}>{contact.name} - {contact.phoneNumber}</li>
            ))}
          </ul>
          <form>
            <label>Name:</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <br />
            <label>Phone Number:</label>
            <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            <br />
            <button onClick={handleAddContact}>Add Contact</button>
          </form>
        </div>
      ) : (
        <p>You need to login to access your contacts.</p>
      )}
    </div>
  );
};

export default Contact;