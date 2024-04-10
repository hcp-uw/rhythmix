import React, { Component, ChangeEvent, MouseEvent } from "react";


// const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
// const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";

// // access token, and the function to update the token
// const [ accessToken, setAccessToken ] = useState("");
// // stores current list of albums
// const [ albums, setSongs ] = useState([]);

type SongMatchProps = {
    // default values

    
}


type SongMatchState = {
    // search bar content
    currentSearch: string;
    currentPage: "home" | "songlist" | "recommendations" | "playlist";

    // match pool content
    
}


export class SongMatch extends Component<SongMatchProps, SongMatchState> {

    constructor(props: SongMatchProps) {

        super(props);

        this.state = {
            currentSearch: "",
            currentPage: "home"
            
            
        }
    }
    
    
    // // how we run initializing of spotify api
    // // runs once when starting react app
    // useEffect(() => {
    //     // API Access Token
    //     var authParameters = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    //     }
    //     // call to get token, and update value
    //     fetch('https://accounts.spotify.com/api/token', authParameters)
    //         .then(result => result.json())
    //         .then(data => setAccessToken(data.access_token))
    // }, [])


    render = (): JSX.Element => {
        

        // if we're on start page
        if (this.state.currentPage === "home") {
            // render start page
            return (
                this.renderHomePage()
            );
        } else {
            return (
                <div>other page</div>
            );
        }

    }


    renderHomePage = (): JSX.Element => {
        return (
            <div>
                <label>
                Search Song:
                <input type="text" value={this.state.currentSearch} onChange={this.doSearchChange}></input>
                </label>
                <button onClick={this.doSearchClick}>Search</button>
            </div>
        );
    }





    /**
     * SEARCH BAR HANDLER FUNCTIONS
     */

    // updates search value
    doSearchChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        const search = evt.target.value;
        this.setState( {currentSearch: search})
    }

    // searchs song (calls sppotify api to find songs)
    doSearchClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        


    }

}



