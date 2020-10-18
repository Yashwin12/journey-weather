import React from 'react';
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import LandingPage from '../src/components/LandingPage'

function App() {
  return (
    <div className="App">
    <Router>
      <Switch> 
        <Route exact path = "/" component = {LandingPage} />
        <Route path="*" component = {LandingPage} />          
      </Switch>        
    </Router>      
  </div>

  );
}

export default App;
