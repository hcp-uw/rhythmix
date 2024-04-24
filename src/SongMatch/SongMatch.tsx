import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Root } from "react-dom/client";
import './index.css';
import SearchBar from "./SearchBar";


// const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
// const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";

type SongMatchProps = {
    // Initial State of the File (props we are passing into this component)
   

    // Callback buttons to pass back information as props
    onBack: () => void;
}


type SongMatchState = {
    // search bar content
    currentSearch: string;
    currentPage: "home" | "searchbar" | "songlist" | "recommendations" | "playlist";
    errorMessage: string;
    song: string;

    // match pool content
    
}


export class SongMatch extends Component<SongMatchProps, SongMatchState> {

    constructor(props: SongMatchProps) {

        super(props);

        this.state = {
            currentSearch: "test",
            currentPage: "home",
            errorMessage: "",
            song: ""
            
            
            
        }
    }
    


    render = (): JSX.Element => {
        

        // if we're on start page
        if (this.state.currentPage === "home") {
            // render start page
            return (
                <div className="background">
                    {this.renderStartPage()}
                </div>
            );
        } else if (this.state.currentPage === "searchbar") {
            return (
                <SearchBar/>
            )

        } else {
            return (
                <div>other page</div>
            );
        }


    }


    renderStartPage = (): JSX.Element => {
        return (
            <div>
                <label>
                Search Song:
                <input type="text" value={this.state.currentSearch} onChange={this.doSearchChange}></input>
                </label>
                <button onClick={this.doSearchClick}>Search</button>
                
                <button onClick={this.doSearchBarClick}>SEARCH BAR TYPE SHIT</button>

                <br/>
                <button onClick={this.doBackClick}>Back</button>
            </div>
        );
    }


    /**
     * SEARCH BAR TESTING
     */
    doSearchBarClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.setState({currentPage: "searchbar"})
    }

    /**
     * BACK BUTTON HANDLER FUNCTIONS
     */
    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        return this.props.onBack();
    }



    /**
     * SEARCH BAR HANDLER FUNCTIONS
     */

    // updates search value
    doSearchChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState( {currentSearch: evt.target.value});
    }

    // searchs song (calls sppotify api to find songs)
    doSearchClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        // if the search bar is empty
        if (this.state.currentSearch === undefined || this.state.currentSearch === "") {
            //show error message saying they need to type something in the search bar
            this.setState({errorMessage: "Please enter a Song in the Search Bar"});

        } else {    // searchbar is not empty, SEARCH



        }

    }


}



