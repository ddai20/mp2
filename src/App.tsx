import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import logo from './logo.svg';
import './App.scss';

function App() {
  return (
    <BrowserRouter basename='\mp2'>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
