import React, { Component, ChangeEvent } from "react";
import { Root } from "react-dom/client";
import "./CustomPlaylist.css";
import { auth_pkce } from "../auth.js";

type Page = {kind: "basic_sliders"} | {kind: "all_sliders"} | {kind: "result"};

type CustomPlaylistState = {
  root: Root;
  page: Page;
  attributes: Map<string, number>;
  access_token: string | null;
};

type CustomPlaylistProps = {
  root: Root;
}

const all_attributes : Array<string> = ["tempo", "energy", "popularity", "loudness", "acousticness", "danceability", "duration", "instrumentalness", "key", "liveness", "mode", "speechiness", "time signature", "valence"];

const playlist_size : bigint = 25n;

export class CustomPlaylist extends Component<CustomPlaylistProps, CustomPlaylistState> {
  constructor(props: CustomPlaylistProps) {
    super(props);
    this.state = {root: props.root, page: {kind: "basic_sliders"}, attributes: new Map<string, number>(), access_token: null};
    for (let i = 0; i < all_attributes.length; i++) {
      this.state.attributes.set(all_attributes[i], 1);
    }
  };

  render = () : JSX.Element => {
    if (this.state.page.kind === "basic_sliders") {
      return <div className="CPG-background">
        <h1>custom playlist</h1>
        <button type="button" onClick={this.doResultClick}>create playlist</button>
        <button type="button" onClick={this.doAllSlidersClick}>more options</button>
        {this.renderSliders()}
        <button type="button" onClick={this.doBackClick}>back</button>
      </div>;
    } else if (this.state.page.kind === "all_sliders") {
      return <div className="CPG-background">
        <button type="button" onClick={this.doResultClick}>create playlist</button>
        <button type="button" onClick={this.doBasicSlidersClick}>fewer options</button>
        {this.renderSliders()}
        <button type="button" onClick={this.doBackClick}>back</button>
      </div>;
    } else {
      return <div className="CPG-background">
        <h1>your custom playlist</h1>
        <button type="button" onClick={this.doBackClick}>back</button>
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

  doBackClick = () : void => {
    this.state.root.unmount();
  };

  doResultClick = () : void => {
    this.setState({page: {kind: "result"}});
    this.doSpotifyFetchClick();
  }

  doAllSlidersClick = () : void => {
    this.setState({page: {kind: "all_sliders"}});
  }

  doBasicSlidersClick = () : void => {
    this.setState({page: {kind: "basic_sliders"}});
  }

  doAttributeChange = (_evt: ChangeEvent<HTMLInputElement>) : void => {
    this.state.attributes.set(_evt.target.id, parseFloat(_evt.target.value));
  }


  doSpotifyFetchClick = async () : Promise<void> => {
    //const fetch_url = "https://api.spotify.com/v1/recommendations?limit=" + playlist_size
    //              + "&seed_genres=classical&2Ccountry";
    const fetch_url = "https://api.spotify.com/v1/recommendations?seed_artists=3qm84nBOXUEQ2vnTfUTTFC&min_tempo=170&max_tempo=180";
    const access_token = await auth_pkce();
    //this.setState({access_token: access_token});
    const auth = "Bearer " + this.state.access_token;
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
    //alert(JSONresponse.tracks);
  }

  doGeneralError = (msg: string) : void => {
    //alert(msg);
  }

  /**
   * FUNCTIONS:
   * 
   * - some general interaction function with spotify api
   * - preserve slider states between more/fewer sliders
   */
}