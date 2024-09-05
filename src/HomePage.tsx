import React, { Component, ChangeEvent } from "react";
import "./HomePage.css";
import { CustomPlaylist } from './CustomPlaylist/CustomPlaylist.tsx';
import { SongMatch } from './SongMatch/SongMatch.tsx';
import ReactDOM from 'react-dom/client';
import { updatePlaylistsClick, genreToPlaylistMap } from './DiscoverDaily/DiscoverDaily.tsx';
import logo from "./logo.png";
import { loginWithSpotifyClick, logoutClick } from "./spotify.js";

export const accessTokenGLOBAL = localStorage.getItem('access_token');

type HomePageState = {
  genre: string;
  page: { kind: "home" } | { kind: "songmatch" };
};

export class HomePage extends Component<null, HomePageState> {
  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      genre: "R&B",
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
    // console.log("access token: " + localStorage.getItem('access_token'));
    // console.log("refresh token: " + localStorage.getItem('refresh_token'));
    // console.log("expires in: " + localStorage.getItem('expires_in'));
    // console.log("expires: " + localStorage.getItem('expires'));

    // Login button before home page access
    if (localStorage.getItem('access_token') == null) {
      return (
        <div className="login-page">
          <img src={logo} alt="" width="200" height="200" />
          <button className="login-button" type="button" onClick={this.doLoginSpotify}> Login to Spotify </button>
        </div>
      );
    } else {
      if (this.state.page.kind === "home") {
        // updatePlaylistsClick();

        return (
          <div className="App">
            {/* Logo and title */}
            <header className="header">
              <h1> <img src={logo} alt="" width="80" height="80" /> spotiblend </h1>
            </header>

            {/* Main 3 features */}
            <div className="block-spacing">
              <div className="dd-bg">
                <iframe
                  title="custom_playlist"
                  src={genreToPlaylistMap.get(this.state.genre)}
                  width="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>

                {/* Genre dropdown below the playlist iframe */}
                  <select
                    id="genre"
                    name="genre"
                    defaultValue="R&B"
                    onChange={this.doGenreChange}
                    className="styled-select"
                  >
                    <option value="Pop">Pop</option>
                    <option value="Hip-Hop">Hip-Hop</option>
                    <option value="Indie">Indie</option>
                    <option value="R&B">R&B</option>
                  </select>
              </div>

              <button className="cp-bg" type="button" onClick={CustomPlaylistClick}></button>
              <button className="sm-bg" type="button" onClick={this.doSongMatchClick}></button>
            </div>

              {/* Temporary buttons for debugging */}
              <button type="button" onClick={this.doLogoutSpotify}> Logout of Spotify </button>
              <button type="button" onClick={this.doUpdatePlaylists}> Update Playlists </button>
              {/* <button type="button" onClick={this.doDeletePlaylists}> Delete Custom Playlists </button> */}
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

  doUpdatePlaylists = () => {
    updatePlaylistsClick();
  };

  // doDeletePlaylists = () => {
  //   deletePlaylistsClick();
  // }
  
  doGenreChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
      this.setState({genre: document.getElementById("genre").value});
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
