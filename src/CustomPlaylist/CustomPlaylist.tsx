/**
 * TODO:
 * 
 * - figure out slider ranges?? weird
 * 
 */

import React, { Component } from "react";
import { Root } from "react-dom/client";
import "./index.css";

type Page = {kind: "basic_sliders"} | {kind: "all_sliders"} | {kind: "result"};

type CustomPlaylistState = {
  root: Root;
  page: Page;
  attributes: Map<string, BigInt>;
};

type CustomPlaylistProps = {
  root: Root;
}

const all_attributes : Array<string> = ["tempo", "energy", "popularity", "loudness", "acousticness", "danceability", "duration", "instrumentalness", "key", "liveness", "mode", "speechiness", "time signature", "valence"];

const playlist_size : bigint = 25n;

export class CustomPlaylist extends Component<CustomPlaylistProps, CustomPlaylistState> {
  constructor(props: CustomPlaylistProps) {
    super(props);
    this.state = {root: props.root, page: {kind: "basic_sliders"}, attributes: new Map<string, BigInt>()};
  };

  render = () : JSX.Element => {
    if (this.state.page.kind === "basic_sliders") {
      return <div className="background">
        <h1>custom playlist</h1>
        <button type="button" onClick={this.doResultClick}>create playlist</button>
        <button type="button" onClick={this.doAllSlidersClick}>more options</button>
        {this.renderSliders()}
        <button type="button" onClick={this.doBackClick}>back</button>
      </div>;
    } else if (this.state.page.kind === "all_sliders") {
      return <div className="background">
        <button type="button" onClick={this.doResultClick}>create playlist</button>
        <button type="button" onClick={this.doBasicSlidersClick}>fewer options</button>
        {this.renderSliders()}
        <button type="button" onClick={this.doBackClick}>back</button>
      </div>;
    } else {
      return <div className="background">
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
          <div>
            <label htmlFor={curr_attribute}>{curr_attribute}</label>
            <input type="range" min="1" max="11" id={curr_attribute}></input>
          </div>
        )
      } else if (curr_attribute === "popularity") {
        slider_render.push(
          <div>
            <label htmlFor={curr_attribute}>{curr_attribute}</label>
            <input type="range" min="1" max="100" id={curr_attribute}></input>
          </div>
        )
      } else {
        slider_render.push(
          <div>
            <label htmlFor={curr_attribute}>{curr_attribute}</label>
            <input type="range" min="0" max="1" step="0.01" id={curr_attribute}></input>
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
  }

  doAllSlidersClick = () : void => {
    this.setState({page: {kind: "all_sliders"}});
  }

  doBasicSlidersClick = () : void => {
    this.setState({page: {kind: "basic_sliders"}});
  }

  /**
   * FUNCTIONS:
   * 
   * - some general interaction function with spotify api
   * - each slider - modify corresponding value in map
   * - preserve slider states between more/fewer sliders
   */
}