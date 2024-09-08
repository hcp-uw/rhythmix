import React, { Component, ChangeEvent } from "react";
import "./HomePage.css";
import { CustomPlaylist } from './CustomPlaylist/CustomPlaylist.tsx';
import { SongMatch } from './SongMatch/SongMatch.tsx';
import { updatePlaylists, genreToPlaylistMap } from './DiscoverDaily/DiscoverDaily.tsx';
import logo from "../src/white_filled_logo.png";
import { loginWithSpotifyClick, logoutClick } from "./spotify.js";

export const accessTokenGLOBAL = localStorage.getItem('access_token');

type HomePageState = {
  genre: string;
  page: "home" | "song_match" | "custom_playlist";
  displayPlaylist: boolean;
};

export class HomePage extends Component<null, HomePageState> {
  constructor(props: null) {
    super(props);
    this.state = {
      genre: "Pop",
      page: "home",
      displayPlaylist: false,
    };
  }

  componentDidMount = () => {
    this.hidePlaylist();
  };

  hidePlaylist = () => {
    setTimeout(() => {
      this.setState({ displayPlaylist: true });
    }, 750);
  };

  render = (): JSX.Element => {
    let expires_at: string | null = localStorage.getItem('expires_at');
    if (expires_at === null) {
      expires_at = "0";
    }

    // Login button before home page access
    if (localStorage.getItem('access_token') == null || localStorage.getItem('access_token') === 'undefined' || parseInt(expires_at, 10) <= Date.now()) {
      return (
        <div className="login-page">
          <img src={logo} alt="" width="200" height="200" />
          <button className="login-button" type="button" onClick={this.doLoginSpotify}> Log in to Spotify </button>
        </div>
      );
    } else if (this.state.page === "home") {
      return (
        <div className="App">
          {/* Logo and title */}
          <header className="header">
            <img src={logo} alt="logo" /> {/* Logo */}
            <h1>spotiblend</h1> {/* Text */}
            <button className="logout-button" onClick={this.doLogoutSpotify}>
              Logout
            </button>
          </header>

          {/* Main 3 features */}
          <div className="block-spacing">
            <div className="overlap-container">
              <div className="dd-block dd-bg">
                <iframe
                  title="discover_daily"
                  src={genreToPlaylistMap.get(this.state.genre)?.link}
                  width="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>

                {/* Genre dropdown below the playlist iframe */}
                <select
                  id="genre"
                  name="genre"
                  defaultValue={this.state.genre}
                  onChange={this.doGenreChange}
                  className="styled-select"
                >
                  <option value="Pop">Pop</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="Indie">Indie</option>
                  <option value="R&B">R&B</option>
                </select>

                <div>
                  {!this.state.displayPlaylist && (
                    <div className="dd-block dd-hide">
                      <div className="loading-dots">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Left: Custom Playlist Generator */}
            <button className="cp-bg" type="button" onClick={this.doCustomPlaylistClick}>
              <span className="rectangle-label">Custom Playlist Generator</span>
            </button>

            {/* Middle: Song Match */}
            <button className="sm-bg" type="button" onClick={this.doSongMatchClick}>
              <span className="rectangle-label">Song Match</span>
            </button>
          </div>

          {/* Temporary buttons for debugging */}
          <button type="button" onClick={this.doUpdatePlaylists}>Update Playlists</button>
        </div>
      );
    } else if (this.state.page === "song_match") {
      return <SongMatch onBack={this.doBackClick} />;
    } else {
      return <CustomPlaylist onHome={this.doBackClick} />;
    }
  };

  doLoginSpotify = () => {
    loginWithSpotifyClick();
  };

  doLogoutSpotify = () => {
    logoutClick();
  };

  doUpdatePlaylists = () => {
    updatePlaylists();
  };

  doGenreChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ genre: document.getElementById("genre")?.value, displayPlaylist: false });
    this.hidePlaylist();
  };

  doSongMatchClick = (): void => {
    this.setState({ page: "song_match" });
  };

  doCustomPlaylistClick = (): void => {
    this.setState({ page: "custom_playlist" });
  };

  doBackClick = (): void => {
    this.setState({ page: "home", displayPlaylist: false });
    this.hidePlaylist();
  };
}
