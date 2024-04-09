import React, { Component } from "react";
import { Root } from "react-dom/client";

type CustomPlaylistState = {
  root: Root;
};

type CustomPlaylistProps = {
  root: Root;
}

export class CustomPlaylist extends Component<CustomPlaylistProps, CustomPlaylistState> {
  constructor(props: CustomPlaylistProps) {
    super(props);
    this.state = {root: props.root};
  };

  render = () : JSX.Element => {
    return <div>
      <h1>Hi</h1>
      <button type="button" onClick={this.doBackClick}>Back</button>
    </div>;
  };

  doBackClick = () : void => {
    this.state.root.unmount();
  };
}