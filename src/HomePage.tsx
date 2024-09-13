import React, { Component, ChangeEvent } from "react";
import "./HomePage.css";
import { CustomPlaylist } from './CustomPlaylist/CustomPlaylist.tsx';
import { SongMatch } from './SongMatch/SongMatch.tsx';
import logo from "../src/logo.png";
import { loginWithSpotifyClick, logoutClick } from "./spotify.js";

export const accessTokenGLOBAL = localStorage.getItem('access_token');

const genreToPlaylistMap = new Map<string, string>([
  ["pop", "https://open.spotify.com/embed/playlist/6WZx6JODAeplGmQL7YBXfK?utm_source=generator"],
  ["hip-hop", "https://open.spotify.com/embed/playlist/5n9846Hwm6OsDicJ5a0v6f?utm_source=generator"],
  ["indie", "https://open.spotify.com/embed/playlist/1JHl3qS08VD8Qcb0pfqGU3?utm_source=generator"],
  ["r&b", "https://open.spotify.com/embed/playlist/2ooZlUQuH5xNgrJkD1dpe5?utm_source=generator"],
  ["edm", "https://open.spotify.com/embed/playlist/0T0JF0dPzzczmQ3hV9x2q5?utm_source=generator"],
  ["romance", "https://open.spotify.com/embed/playlist/6vGCq5o22Q2o351Nim1TLJ?utm_source=generator"],
  ["k-pop", "https://open.spotify.com/embed/playlist/37A4pqUHFQwR1GqNZI8qII?utm_source=generator"],
  ["workout", "https://open.spotify.com/embed/playlist/5W8GJqJ4GaJ3NkEOrjTRSf?utm_source=generator"],
  ["alternative", "https://open.spotify.com/embed/playlist/3nu8tauOOkdwZVjWYXCrlS?utm_source=generator"],
  ["chill", "https://open.spotify.com/embed/playlist/4v2VPL4rzfFKAdQS6z9gQj?utm_source=generato"]
]);

type HomePageState = {
  genre: string;
  page: "home" | "song_match" | "custom_playlist";
  displayPlaylist: boolean;
};

export class HomePage extends Component<null, HomePageState> {
  constructor(props: null) {
    super(props);
    this.state = {
      genre: "pop",
      page: "home",
      displayPlaylist: false,
    };
  }

  componentDidMount = () => {
    console.log("Refresh token: " + localStorage.getItem('refresh_token'));
    this.hidePlaylist();
  };

  hidePlaylist = () => {
    setTimeout(() => {
      this.setState({ displayPlaylist: true });
    }, 1000);
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
            <img src={logo} alt="logo" />
            <h1> spotiblend </h1>
          </header>

          {/* Main 3 features */}
          <div className="block-spacing">
            <div className="overlap-container">
              <div className="dd-block dd-bg">
                <iframe
                  title="discover_daily"
                  src={genreToPlaylistMap.get(this.state.genre)}
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

                  <option value="alternative">alternative</option>
                  <option value="chill">chill</option>
                  <option value="edm">edm</option>
                  <option value="hip-hop">hip-hop</option>
                  <option value="indie">indie</option>
                  <option value="k-pop">k-pop</option>
                  <option value="pop">pop</option>
                  <option value="r&b">r&b</option>
                  <option value="romance">romance</option>
                  <option value="workout">workout</option>

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

            {/* Middle: Custom Playlist Generator */}
            <button className="cp-bg" type="button" onClick={this.doCustomPlaylistClick}>
              <span className="cp-label">custom playlist generator</span>
              <p className="block-description">adjust a variety of song attributes to craft the perfect playlist for any vibe :)</p>
            </button>

            {/* Right: Song Match */}
            <button className="sm-bg" type="button" onClick={this.doSongMatchClick}>
              <span className="sm-label">song match</span>
              <p className="block-description">discover music that matches your mood and personal favorites!</p>
            </button>
          </div>

          <header className="footer">
            <button className="logout-button" onClick={this.doLogoutSpotify}> Logout </button>
            <p> © 2024 spotiblend. All rights reserved. </p>
          </header>
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
