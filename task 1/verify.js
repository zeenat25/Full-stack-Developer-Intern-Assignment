// verify.js
import React, { useState } from 'react';
import axios from 'axios';

const Verify = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/verify', {
        email,
        otp,
      });
      alert('Account verified successfully.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Verify Account</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <br />
        <label>
          OTP:
          <input type="text" value={otp} onChange={(event) => setOtp(event.target.value)} />
        </label>
        <br />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default Verify;