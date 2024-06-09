import React, { useState, useEffect } from 'react';
import api from './api/api';
import SpamList from './SpamList';

const MarkSpam = () => {
  const [spamNumbers, setSpamNumbers] = useState([]);
  const [spamLikelihood, setSpamLikelihood] = useState({});

  useEffect(() => {
    api.getSpamNumbers().then((response) => {
      setSpamNumbers(response.data);
      response.data.forEach((number) => {
        setSpamLikelihood((prev) => ({...prev, [number]: calculateSpamLikelihood(number) }));
      });
    });
  }, []);

  const handleMarkSpam = (phoneNumber) => {
    api.markSpam(phoneNumber).then((response) => {
      setSpamNumbers((prev) => [...prev, phoneNumber]);
      setSpamLikelihood((prev) => ({...prev, [phoneNumber]: calculateSpamLikelihood(phoneNumber) }));
    });
  };

  return (
    <div>
      <h1>Mark Spam App</h1>
      <input type="text" id="phoneNumber" placeholder="Enter phone number" />
      <button id="markSpamButton" onClick={() => handleMarkSpam(document.getElementById('phoneNumber').value)}>Mark as Spam</button>
      <SpamList spamNumbers={spamNumbers} spamLikelihood={spamLikelihood} />
    </div>
  );
};

export default MarkSpam;