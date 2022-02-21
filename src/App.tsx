import React from 'react';
import Routes from '@/router'
import './App.css';
const { HashRouter, Switch } = require("react-router-dom");

const App: React.FC = (props): any => {
  return (
    <HashRouter>
      <Switch>
        <Routes auth={{}} />
      </Switch>
    </HashRouter>
  )
}

export default App;
