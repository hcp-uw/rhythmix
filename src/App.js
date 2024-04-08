import './App.css';
import * as React from 'react';

function App() {

  const CustomPlaylistClick = () => {
    alert("custom playlist");
  }

  const SongMatchClick = () => {
    alert("song match");
  };

  return (
    <div className="App">
      <header class="header">
        <h1> SpotiBlend </h1>
      </header>
      <div class="container">
        <button class="button" type="button"> </button>
        <button class="button" type="button" onClick={CustomPlaylistClick}> </button>
        <button class="button" type="button" onClick={SongMatchClick}> </button>
      </div>
    </div>
  );
}

export default App;
