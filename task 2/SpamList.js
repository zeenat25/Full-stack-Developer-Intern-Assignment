import React from 'react';

const SpamList = ({ spamNumbers, spamLikelihood }) => {
  return (
    <ul id="spamList">
      {spamNumbers.map((number) => (
        <li key={number}>
          {number} - Spam Likelihood: {spamLikelihood[number]}
        </li>
      ))}
    </ul>
  );
};

export default SpamList;