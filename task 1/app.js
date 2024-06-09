import React, { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import contact from './contact';
import verify from './verify';

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <h1>User Authentication and Personal Contacts</h1>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/contact" component={contact} />
          <Route path="/verify" component={verify} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
