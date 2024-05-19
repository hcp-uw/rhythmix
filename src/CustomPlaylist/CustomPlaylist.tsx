import React, { Component, ChangeEvent } from "react";
import { Root } from "react-dom/client";
import "./CustomPlaylist.css";
import { auth_pkce } from "../auth.js";

type Page = {kind: "genres"} | {kind: "basic_sliders"} | {kind: "all_sliders"} | {kind: "result"};

type CustomPlaylistState = {
  root: Root;
  page: Page;
  attributes: Map<string, number>;
  genres: Set<string>;
  access_token: string | null;
};

type CustomPlaylistProps = {
  root: Root;
}

const all_attributes : Array<string> = ["tempo", "energy", "popularity", "loudness", "acousticness", "danceability", "duration", "instrumentalness", "key", "liveness", "mode", "speechiness", "time signature", "valence"];

const all_genres : Array<string> = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"];

const playlist_size : bigint = 25n;

export class CustomPlaylist extends Component<CustomPlaylistProps, CustomPlaylistState> {
  constructor(props: CustomPlaylistProps) {
    super(props);
    this.state = {root: props.root, page: {kind: "genres"}, attributes: new Map<string, number>(), genres: new Set<string>(), access_token: null};
    for (let i = 0; i < all_attributes.length; i++) {
      this.state.attributes.set(all_attributes[i], 1);
    }
  };

  render = () : JSX.Element => {
    if (this.state.page.kind === "genres") {
      return <div className="CPG-base">
        <h1 className="CPG-header">custom playlist</h1>
        <div className="CPG-background">
          {this.renderGenres()}
          <button className="next-button" type="button" onClick={this.doBasicSlidersClick}>next</button>
          <button className="home-button" type="button" onClick={this.doHomeClick}>home</button>
        </div>
      </div>;
    }
    if (this.state.page.kind === "basic_sliders") {
      return <div className="CPG-base">
        <h1 className="CPG-header">custom playlist</h1>
        <div className="CPG-background">
          <button className="create-playlist-button" type="button" onClick={this.doResultClick}>create playlist</button>
          <button type="button" onClick={this.doAllSlidersClick}>more options</button>
          {this.renderSliders()}
          <button type="button" onClick={this.doBackClick}>back</button>
          <button className="home-button" type="button" onClick={this.doHomeClick}>home</button>
        </div>
      </div>;
    } else if (this.state.page.kind === "all_sliders") {
      return <div className="CPG-base">
        <div className="CPG-background">
          <button className="create-playlist-button" type="button" onClick={this.doResultClick}>create playlist</button>
          <button type="button" onClick={this.doBasicSlidersClick}>fewer options</button>
          {this.renderSliders()}
          <button type="button" onClick={this.doBackClick}>back</button>
          <button className="home-button" type="button" onClick={this.doHomeClick}>home</button>
        </div>
      </div>;
    } else {
      return <div className="CPG-base">
        <h1 className="CPG-header">your custom playlist</h1>
        <div className="CPG-background">
          <button className="home-button" type="button" onClick={this.doHomeClick}>home</button>
        </div>
      </div>;
    }
  };

  renderSliders = () : JSX.Element[] => {
    let num_sliders : bigint = 0n;
    if (this.state.page.kind === "basic_sliders") {
      num_sliders = 4n;
    } else {
      num_sliders = BigInt(all_attributes.length);
    }

    const slider_render : JSX.Element[] = [];
    for (let i = 0; i < num_sliders; i++) {
      const curr_attribute = all_attributes[i];

      if (curr_attribute === "time signature" || curr_attribute === "key") {
        slider_render.push(
          <div className="slider-container">
            <label htmlFor={curr_attribute} className="slider-label">{curr_attribute}</label>
            <input type="range" min="1" max="11" id={curr_attribute} onChange={this.doAttributeChange}></input>
          </div>
        )
      } else if (curr_attribute === "popularity") {
        slider_render.push(
          <div className="slider-container">
            <label htmlFor={curr_attribute} className="slider-label">{curr_attribute}</label>
            <input type="range" min="1" max="100" id={curr_attribute} onChange={this.doAttributeChange}></input>
          </div>
        )
      } else {
        slider_render.push(
          <div className="slider-container">
            <label htmlFor={curr_attribute} className="slider-label">{curr_attribute}</label>
            <input type="range" min="0" max="1" step="0.01" id={curr_attribute} onChange={this.doAttributeChange}></input>
          </div>
        )
      }
    }

    return slider_render;
  }

  renderGenres = () : JSX.Element[] => {
    const genre_render : JSX.Element[] = [];
    for (let i = 0; i < all_genres.length; i += 7) {
      genre_render.push(
        <React.Fragment>
          <div className="genres">
            <tr>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i]} name={all_genres[i]} value={all_genres[i]} />
                <label htmlFor={all_genres[i]}>{all_genres[i]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 1]} name={all_genres[i + 1]} value={all_genres[i + 1]} />
                <label htmlFor={all_genres[i + 1]}>{all_genres[i + 1]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 2]} name={all_genres[i + 2]} value={all_genres[i + 2]} />
                <label htmlFor={all_genres[i + 2]}>{all_genres[i + 2]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 3]} name={all_genres[i + 3]} value={all_genres[i + 3]} />
                <label htmlFor={all_genres[i + 3]}>{all_genres[i + 3]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 4]} name={all_genres[i + 4]} value={all_genres[i + 4]} />
                <label htmlFor={all_genres[i + 4]}>{all_genres[i + 4]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 5]} name={all_genres[i + 5]} value={all_genres[i + 5]} />
                <label htmlFor={all_genres[i + 5]}>{all_genres[i + 5]}</label>
              </td>
              <td>
                <input className="checkboxes" type="checkbox" onChange={this.doGenreClick} id={all_genres[i + 6]} name={all_genres[i + 6]} value={all_genres[i + 6]} />
                <label htmlFor={all_genres[i + 6]}>{all_genres[i + 6]}</label>
              </td>
            </tr>
          </div>
        </ React.Fragment>
      );
    }
    return genre_render;
  }

  doGenreClick = (evt: ChangeEvent<HTMLInputElement>) : void => {
    if (this.state.genres.has(evt.target.id)) {
      this.state.genres.delete(evt.target.id);
    } else {
      if (this.state.genres.size >= 5) {
        alert("Cannot select more than 5 seed genres");
        const checkbox = document.getElementById(evt.target.id) as HTMLInputElement;
        checkbox.checked = false;        
      } else {
        this.state.genres.add(evt.target.id);
      }
    }
  }

  doHomeClick = () : void => {
    this.state.root.unmount();
  };

  doBackClick = () : void => {
    this.setState({page: {kind: "genres"}});
  }

  doResultClick = () : void => {
    this.setState({page: {kind: "result"}});
    this.doSpotifyFetchClick();
  }

  doAllSlidersClick = () : void => {
    this.setState({page: {kind: "all_sliders"}});
  }

  doBasicSlidersClick = () : void => {
    if (this.state.genres.size === 0) {
      alert("Must select at least 1 seed genre.");
    } else {
      this.setState({page: {kind: "basic_sliders"}});
    }
  }

  doAttributeChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    //Creates new map so react recognizes change
    const newAttributes = new Map(this.state.attributes);
    newAttributes.set(evt.target.id, parseFloat(evt.target.value));
    this.setState({ attributes: newAttributes });
  };


  doSpotifyFetchClick = () : void => {
    //const fetch_url = "https://api.spotify.com/v1/recommendations?limit=" + playlist_size
    //              + "&seed_genres=classical&2Ccountry";
    
    auth_pkce();
    this.setState({access_token: localStorage.getItem('access_token')});
    const fetch_url = "https://api.spotify.com/v1/recommendations?seed_artists=3qm84nBOXUEQ2vnTfUTTFC&min_tempo=170&max_tempo=180";
    const auth = "Bearer " + this.state.access_token;
    //alert(auth)
    fetch(fetch_url, {
      method: "GET",
      headers: {
        Authorization: auth,
      }
    }).then(this.doSpotifyFetch)
      .catch(() => this.doGeneralError("Failed to connect to server on doSpotifyFetch"));
  }

  doSpotifyFetch = (res: Response) : void => {
    if (res.status === 200) {
      res.json().then(this.doSpotifyFetchJson)
              .catch(() => this.doGeneralError("200 response is not valid JSON"));
    } else if (res.status === 401 || res.status === 403) {
      res.text().then(this.doGeneralError)
              .catch(() => this.doGeneralError(res.status + " response is not text"));
    } else {
      this.doGeneralError("Bad status code: " + res.status);
    }
  };

  doSpotifyFetchJson = (obj: string) : void => {
    const JSONresponse = JSON.parse(obj);
    console.log(JSONresponse.tracks);
  }

  doGeneralError = (msg: string) : void => {
    //alert(msg);
  }

  /**
   * FUNCTIONS:
   * - prompt users for 1-5 genres before slider selection begins.
   * - some general interaction function with spotify api
   * - preserve slider states between more/fewer sliders
   *
   */
}