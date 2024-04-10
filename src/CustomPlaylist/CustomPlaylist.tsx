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
  attributes: Map<String, BigInt>;
};

type CustomPlaylistProps = {
  root: Root;
}

export class CustomPlaylist extends Component<CustomPlaylistProps, CustomPlaylistState> {
  constructor(props: CustomPlaylistProps) {
    super(props);
    this.state = {root: props.root, page: {kind: "basic_sliders"}, attributes: new Map<String, BigInt>()};
  };

  render = () : JSX.Element => {
    if (this.state.page.kind === "basic_sliders") {
      return <div className="background">
        <h1>Hi</h1>
        <button type="button" onClick={this.doBackClick}>Back</button>
      </div>;
    } else if (this.state.page.kind === "all_sliders") {
      return <div className="background">
        <h1>Hi</h1>
        <button type="button" onClick={this.doBackClick}>Back</button>
      </div>;
    } else {
      return <div className="background">
        <h1>Hi</h1>
        <button type="button" onClick={this.doBackClick}>Back</button>
      </div>;
    }
  };

  doBackClick = () : void => {
    this.state.root.unmount();
  };

  /**
   * FUNCTIONS:
   * 
   * - some general interaction function with spotify api
   * - click to change page state to result
   * - each slider - modify corresponding value in map
   * - click to change to basic sliders
   * - click to change to all sliders
   */
}