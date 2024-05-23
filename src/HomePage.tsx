import React, { Component, ChangeEvent } from "react";
import './App.css';
import { CustomPlaylist } from './CustomPlaylist/CustomPlaylist.tsx';
import {SongMatch} from './SongMatch/SongMatch.tsx'
import ReactDOM from 'react-dom/client';
import { UpdatePlaylists, GenreToPlaylistMap } from './DiscoverDaily/DiscoverDaily.tsx';
import { render } from '@testing-library/react';
import logo from "./spotiblend_logo.png";

 
type HomePageState = {
    genre: string;
    page: {kind: "home"} | {kind: "songmatch"};

};
  
type HomePageProps = {
}

export class HomePage extends Component<HomePageProps, HomePageState> {
    constructor(props: HomePageProps) {
        super(props);
        this.state = {
          genre: "Pop",
          page: {kind: "home"}
        }
    }

    /* TODO:
        1. Add spacing between embedded playlist and background
        2. Place genre selector closer to embedded playlist, make it look better
        3. Align logo with header
    */
    render = () : JSX.Element => {
      if (this.state.page.kind === "home") {
          UpdatePlaylists();
          return (
          <div className="App">
          <header className="header">
            <h1> <img src={logo} alt="" width="80" height="80"/> spotiblend </h1>
          </header>
          
        <div className="container">
            <iframe title="custom_playlist" className="block" src={GenreToPlaylistMap.get(this.state.genre)}
              width="100%"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"> </iframe>
            <button className="block1" type="button" onClick={CustomPlaylistClick}> </button>
            <button className="block2" type="button" onClick={this.doSongMatchClick}> </button>
          </div>
          
          <label htmlFor="Genre"> Genre: </label>
              <select id="genre" name="genre" defaultValue="Pop" onChange={this.doGenreChange}>
                <option value="Pop"> Pop </option>
                <option value="Hip-Hop"> Hip-Hop </option>
                <option value="Indie"> Indie </option>
                <option value="R&B"> R&B </option>
              </select>
          </div>);
      } else {
        return (
          <SongMatch
          onBack={this.doBackClick}
          />
        )
      }
    }

    doGenreChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        this.setState({genre: document.getElementById("genre").value});
    };

    /**
     * SONG MATCH FEATURES
     */
    doSongMatchClick = (): void => {
      this.setState({page: {kind: "songmatch"}});
    };

    doBackClick = (): void => {
      this.setState({page: {kind: "home"}});
    }
    
};

const CustomPlaylistClick = () => {
    const custom_playlist: HTMLElement | null = document.getElementById("custom_playlist");
    if (custom_playlist != null) {
        const custom_playlist_root = ReactDOM.createRoot(custom_playlist);
        custom_playlist_root.render(
        <React.StrictMode>
            <CustomPlaylist 
            root = {custom_playlist_root}
            />
        </React.StrictMode>
        );
    }
  };

  