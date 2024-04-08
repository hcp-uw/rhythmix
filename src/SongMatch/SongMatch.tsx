import React, { Component } from "react";


type SongMatchProps = {
    // default values

    
}


type SongMatchState = {
    // search bar content
    currentSearch: string;

    // match pool content
    
}


export class SongMatch extends Component<SongMatchProps, SongMatchState> {

    constructor(props: SongMatchProps) {

        super(props);

        this.state = {
            currentSearch: "",
            
            
        }
    }   
}


