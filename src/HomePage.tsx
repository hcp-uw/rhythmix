import React, { Component, ChangeEvent } from "react";
import "./HomePage.css";
import { CustomPlaylist } from './CustomPlaylist/CustomPlaylist.tsx';
import { SongMatch } from './SongMatch/SongMatch.tsx';
import ReactDOM from 'react-dom/client';
import { UpdatePlaylists, GenreToPlaylistMap } from './DiscoverDaily/DiscoverDaily.tsx';
import logo from "./spotiblend_logo.png";
import { loginWithSpotifyClick, logoutClick } from "./spotify.js";

export const accessTokenGLOBAL = localStorage.getItem('access_token');

type HomePageState = {
  genre: string;
  page: { kind: "home" } | { kind: "songmatch" };
};

type HomePageProps = {}

export class HomePage extends Component<HomePageProps, HomePageState> {
  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      genre: "Pop",
      page: { kind: "home" }
    };
  }

  /* TODO:
      1. Add spacing between embedded playlist and background
      2. Place genre selector closer to embedded playlist, make it look better
      3. Align logo with header
  */
  render = (): JSX.Element => {

    // Authorization debugging
    console.log("access token: " + localStorage.getItem('access_token'));
    console.log("refresh token: " + localStorage.getItem('refresh_token'));
    console.log("expires in: " + localStorage.getItem('expires_in'));
    console.log("expires: " + localStorage.getItem('expires'));

    // Login button before home page access
    if (localStorage.getItem('access_token') == null) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <button type="button" onClick={this.doLoginSpotify}> Login to Spotify </button>
        </div>
      );
    } else {
      if (this.state.page.kind === "home") {
        UpdatePlaylists();

        return (
          <div className="App">
            {/* Logo and title */}
            <header className="header">
              <h1> <img src={logo} alt="" width="80" height="80" /> spotiblend </h1>
            </header>

            {/* Main 3 features */}
            <div className="container">
              <div className="block">
                <iframe
                  title="custom_playlist"
                  src={GenreToPlaylistMap.get(this.state.genre)}
                  width="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>

                {/* Genre dropdown below the playlist iframe */}
                <div className="genre-selector">
                  <select
                    id="genre"
                    name="genre"
                    defaultValue="Pop"
                    onChange={this.doGenreChange}
                    className="styled-select"
                  >
                    <option value="Pop">Pop</option>
                    <option value="Hip-Hop">Hip-Hop</option>
                    <option value="Indie">Indie</option>
                    <option value="R&B">R&B</option>
                  </select>
                </div>
              </div>

              <button className="block1" type="button" onClick={CustomPlaylistClick}></button>
              <button className="block2" type="button" onClick={this.doSongMatchClick}></button>
            </div>

            {/* Temporary button for authorization debugging */}
            <button type="button" onClick={this.doLogoutSpotify}> Logout of Spotify </button>
          </div>
        );
      } else {
        return (
          <SongMatch
            onBack={this.doBackClick}
          />
        );
      }
    }
  };

  doLoginSpotify = () => {
    loginWithSpotifyClick();
  };

  doLogoutSpotify = () => {
    logoutClick();
  };

  doGenreChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ genre: document.getElementById("genre").value });
  };

  /**
   * SONG MATCH FEATURES
   */
  doSongMatchClick = (): void => {
    this.setState({ page: { kind: "songmatch" } });
  };

  doBackClick = (): void => {
    this.setState({ page: { kind: "home" } });
  };
}

const CustomPlaylistClick = () => {
  const custom_playlist: HTMLElement | null = document.getElementById("custom_playlist");
  if (custom_playlist != null) {
    const custom_playlist_root = ReactDOM.createRoot(custom_playlist);
    custom_playlist_root.render(
      <React.StrictMode>
        <CustomPlaylist
          root={custom_playlist_root}
        />
      </React.StrictMode>
    );
  }
};
