// SearchBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/search/name/${searchQuery}`);
        const results = response.data;
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (searchQuery!== '') {
      fetchSearchResults();
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <form>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name"
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {searchResults.map((result) => (
          <li key={result.id}>
            <a href={`/person/${result.id}`}>
              {result.name} ({result.phone}) - Spam likelihood: {result.spamLikelihood}%
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
