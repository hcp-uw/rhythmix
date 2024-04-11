import './App.css';
import { CustomPlaylist } from './CustomPlaylist/CustomPlaylist.tsx';
import { SongMatch } from './SongMatch/SongMatch.tsx'
import * as React from 'react';
import ReactDOM from 'react-dom/client';

function App() {

  const CustomPlaylistClick = () => {
    const custom_playlist_root = ReactDOM.createRoot(document.getElementById("custom_playlist"));
    custom_playlist_root.render(
      <React.StrictMode>
        <CustomPlaylist 
          root = {custom_playlist_root}
        />
      </React.StrictMode>
    );
  }

  const SongMatchClick = () => {
    
  };

  return (
    <div className="App">
      <header class="header">
        <h1> we love vani %lt3 </h1>
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
