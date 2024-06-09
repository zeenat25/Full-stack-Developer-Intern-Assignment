
import React from 'react';
import SearchBar from './c:SearchBar';
import PersonDetails from './PersonDetails';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={SearchBar} />
        <Route path="/person/:id" component={PersonDetails} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;