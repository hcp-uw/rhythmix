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
        <h1> SpotiBlend </h1>
      </header>
      <div class="container">
        <iframe title="custom_playlist" class="block" src="https://open.spotify.com/embed/playlist/4OQzKelZB82tcTuGLTZFuY?utm_source=generator"
        width="100%" allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"> </iframe>
        <button class="block" type="button" onClick={CustomPlaylistClick}> </button>
        <button class="block" type="button" onClick={SongMatchClick}> </button>
      </div>
    </div>
  );
}

export default App;
