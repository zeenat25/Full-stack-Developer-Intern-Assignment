
import React from 'react';
import axios from 'axios';

const PersonDetails = ({ match }) => {
  const id = match.params.id;
  const [person, setPerson] = useState({});

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const response = await axios.get(`/api/person/${id}`);
        const person = response.data;
        setPerson(person);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPersonDetails();
  }, [id]);

  return (
    <div>
      <h2>{person.name}</h2>
      <p>Phone: {person.phone}</p>
      <p>Spam likelihood: {person.spamLikelihood}%</p>
      {person.email && <p>Email: {person.email}</p>}
    </div>
  );
};

export default PersonDetails;