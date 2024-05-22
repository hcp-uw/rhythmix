import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpotifyAuthButton from './SpotifyAuthButton.js';
import Callback from './Callback.js';
import { HomePage } from './HomePage.tsx';
import './index.css';

function App() {
  const main = ReactDOM.createRoot(document.getElementById("main"));
  main.render(
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  )
  return (
    <Router>
        <Routes>
            <Route path="/" element={<SpotifyAuthButton />} />
            <Route path="/callback" element={<Callback />} />
        </Routes>
    </Router>
  );
}

export default App;