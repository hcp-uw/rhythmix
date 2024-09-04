import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Container, InputGroup, FormControl, Button, Row, Col, Card } from 'react-bootstrap';
import { Spotify } from "react-spotify-embed";
import { Root } from "react-dom/client";
import './index.css';
import SearchBar from "./SearchBar";

var accessTokenGLOBAL;

// Specific Songs seedArtist, seedTrack, and seedGenre
type recommendationSeed = {
    seedArtist: string,
    // genre: string,
    seedTrack: string
}


// const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
// const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";


// INTERFACES
type Song = {
    name: string,
    image: any,
    id: string,
    artists: string,
    // genre: string
}

type SongMatchProps = {
    // Initial State of the File (props we are passing into this component)
   

    // Callback buttons to pass back information as props
    onBack: () => void;
}


type SongMatchState = {
    // search bar content
    currentSearch: string;
    currentPage: "home" | "searchbar" | "songlist" | "recommendations" | "playlist" | "getRecs";
    errorMessage: string;
    songResults: any[]; // current list of diplayed songs
    songMatchList: Song[];
    songRecommendations: any[];
    songRecommendationsLINK: String[];
    currID: string;
    playlistSongs: any[];
    finalPlaylistLINK: string;
    
    // match pool content
    
}


export class SongMatch extends Component<SongMatchProps, SongMatchState> {

    constructor(props: SongMatchProps) {

        super(props);

        this.state = {
            currentSearch: "test",
            currentPage: "home",
            errorMessage: "",
            songResults: [],
            songMatchList: [],
            songRecommendations: [],
            songRecommendationsLINK: [],
            currID: "",
            playlistSongs: [],
            finalPlaylistLINK: ""
            
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
        } else if (this.state.currentPage === "getRecs") {
            

            // CHANGE doAddSong to CREATE PLAYLIST
            return(
                
                <div className="background">
                    
                    <Container className="song-container">
                        
                            {this.state.songRecommendations.map( (song, i) => {

                                console.log(song);
                                return (
                                    <div>
                                        <Spotify link={song.external_urls.spotify}/>
                                        <center>
                                            <button onClick={() => this.doCreatePlaylist(song)}>
                                                Create Playlist
                                            </button>
                                        </center>

                                    </div>

                                   
                                )
                            })}
                            
                            
                
                    </Container>

                    <div className="song-container">
                        {this.state.songMatchList.map( (song, i) => {
                            return (
                                <Card className="album-card">
                                    <Card.Img src={song.image}/>
                                    <Card.Body>
                                    <Card.Title>{song.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </div>
                </div>


            )
            
        } else if (this.state.currentPage == "playlist") {
            return (
                <div>
                    <Spotify link={this.state.finalPlaylistLINK}></Spotify>
                </div>
            )
        } else {
            return (
                <div>other page</div>
            );
        }


    }


    renderStartPage = (): JSX.Element => {
        return (
            <div className="divider">
                <Container>
                    <InputGroup className="mb-3" size="lg">
                    <FormControl
                        placeholder="Search for Artist"
                        type="input"
                        onKeyUp={event => {
                        if (event.key === "Enter") {
                            this.searchSong();
                        }
                        }}
                        onChange={this.doSearchChange}
                    />
                    <Button onClick={() => this.searchSong()}>
                        Search
                    </Button>

                    <button onClick={this.doBackClick}>Back</button>
                    </InputGroup>
                </Container>

                <Container className="song-container">
                    
                        {this.state.songResults.map( (song, i) => {
                            return (
                            <Card className="album-card">
                                <Card.Img src={song.album.images[0].url}/>
                                <Card.Body>
                                <Card.Title>{song.name}</Card.Title>
                                <button onClick={() => this.doAddSong(song.name, song.album.images[0].url, song.id, song.artists)}> + </button>
                                </Card.Body>
                            </Card>
                            )
                        })}
                
                </Container>
                
                <div className="song-container">
                        {this.state.songMatchList.map( (song, i) => {
                            return (
                                <Card className="album-card">
                                    <Card.Img src={song.image}/>
                                    <Card.Body>
                                    <Card.Title>{song.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    {this.state.songMatchList.length > 0 && <Button onClick={() => this.doSearchRecs(3, this.state.songMatchList)}>Search</Button>}
                </div>
                
                
            </div>
        )
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
            // run the api call
            this.searchSong();
        }

    }

    /**
     * Song List Management
     */
    

    doAddSong = (name: string, image: any, id: string, artists: string): void => {
        // add song to state array (songMatchList)
        if (this.state.songMatchList.length < 5) {
            const currList = this.state.songMatchList;
            currList.push({name: name, image: image, id: id, artists: artists});
            this.setState({songMatchList: currList});
        } else {
            console.log("too many songs")
        }
        
    }


    searchSong = async (): Promise<void> => {


        const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
        const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";

        

        // API Access Token
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        // call to get token, and update value
        const result = await fetch('https://accounts.spotify.com/api/token', authParameters);
        const data = await result.json();
        const accessToken = data.access_token;

        // store accessToken
        // const accessToken = localStorage.getItem('access_token');
        // console.log(accessToken)

        // GET request using Search to get Artist ID
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        var songID = await fetch('https://api.spotify.com/v1/search?q=' + this.state.currentSearch + '&type=track&limit=10', searchParameters)
            .then(response => response.json())
            // .then(data => console.log(data))  // FOR QUERY TESTING
            .then(data => {this.setState({songResults: data.tracks.items})})
        
    }


    /**
     * New Song Search
     */
    doSearchRecs = (numRecs: number, list: any[]): void => {

        var recs: recommendationSeed[] = [];

        // create list of recs
        for (var i = 0; i < list.length; i++) {
            // stores current song
            const currSong: Song = list[i];

            // translate genre
                // make api call to get list of genres
                // iterate through genre list (take 3), from artist --- check ordering of genres from spotify
                // create string (comma separate w/ no spaces)
            
            // translate artist + copy over
            const recObj: recommendationSeed = {seedArtist: currSong.artists, seedTrack: currSong.id}
            recs.push(recObj);
            
        }
        
        // calculate number of recommendations from each song

        // loop through each song and call getRecommendation() 
        this.getRecommendation(recs, numRecs);



        




        
        
        // call generation of recs (3-5?).
        /*
        Initial reccomndations based on user selections
        1. Create array of song recc seeds using artist, genre, tracks from the song data
        2. API call for spotify reccomendations from the seeds 
        3. Store the reccomended tracks as a list
        4. display song reccomendations <- only difference between matchpool reccomendations and playlist creation

        Creating playlist 
        1. Create array of song recc seeds using artist, genre, tracks from the song data
        2. API call for spotify reccomendations from the seeds 
        3. Store the reccomended tracks as a list
        */

        // Note: add ability to play reccomended songs when they show up
        
        // store recs they chose



    }


    getRecommendation = async (recs: recommendationSeed[], numRecs: number): Promise<void> => {
        this.setState({currentPage: "getRecs"})
        
        const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
        const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";
        
        var fiveRecs: string;

        // DOING JUST track FOR NOW
        fiveRecs = "seed_tracks="

        for (var i = 0; i < this.state.songMatchList.length - 1; i++) {
            fiveRecs += recs[i].seedTrack + ","
        }

        fiveRecs += recs[this.state.songMatchList.length - 1].seedTrack

        var seedTrack = fiveRecs;
        
        // API Access Token
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        // call to get token, and update value
        const result = await fetch('https://accounts.spotify.com/api/token', authParameters);
        const data = await result.json();
        const accessToken = data.access_token;
        // const accessToken = localStorage.getItem('access_token');
        // console.log(accessToken)

        // GET request using /reccomendation to get array of Tracks
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        // var recs = await fetch('https://api.spotify.com/v1/reccomendation?seed_artists=' + seedArtist + '&seed_tracks=' + seedTrack, searchParameters)    
        var spotifyRecs = await fetch('https://api.spotify.com/v1/recommendations?' + seedTrack + '&limit=' + numRecs, searchParameters)    
            .then(response => response.json())
            // .then(data => console.log(data))  // FOR QUERY TESTING
            .then(data => {
                // get list response
                const spotifyRecs = data.tracks
                // get current array
                const array = this.state.songRecommendations
                
                for (var i = 0; i < spotifyRecs.length; i++ ){
                    array.push(data.tracks[i])
                    console.log(data.tracks[i].id + " success") // TEST
                    console.log(data.tracks[i] + "result")
                }

                this.setState({songRecommendations: array})})
    }




    /**
     * Search AFTER choosing Recs
     */
    doCreatePlaylist = async (song: any): Promise<void> => {

        /*
        After the users clicked create playlist
        1. call doSearchRecs to find more songs based on how many match pool songs there are and how large the playlist will be
            2 in pool and 20 song playlist = 10 songs based on reccs from each song in pool
        2. Create playlist api call
            Spotify user authentication to create playlist for users account
        3. Add all reccomended songs
        */

        console.log(song)

        // get list of recommendationSeed[]
            // call getRecommendation()
        this.doGetPlaylistSongs(song.id)
        
        // state will update songRecommendations to be used for the playlist


        // API Access Token
        const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
        const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";

        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&scope=user-read-private user-read-email'
        }
        // call to get token, and update value
        const result = await fetch('https://accounts.spotify.com/api/token', authParameters);
        const data = await result.json();
        const accessToken = data.access_token;
        // const accessToken = localStorage.getItem('access_token');
        // console.log(accessToken)

        // REPLACE - const access_token = localStorage.getItem('access_token');

        // GET request using /reccomendation to get array of Tracks
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }


        // need to get userID of logged in person
        var user = await fetch("https://api.spotify.com/v1/me", searchParameters)
            .then(response => response.json())
            .then(data => {
                console.log("HERE IS THE API CALL FOR GETTING CURRENT USER" + data.id)
                this.setState({currID: data.id})
            })


        var playlistParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                name: "Spotiblend Playlist"
            })
        }

        console.log("CURRENT USER + " + this.state.currID)
        // create the playlist based on songRecommendations
        var createPlaylist = await fetch("https://api.spotify.com/v1/users/" + this.state.currID + "/playlists" , playlistParameters)
            .then(response => response.json())
            .then(data => {

                console.log("INSIDE CREATEPLAYLIST API CALL")
                console.log(data)

                this.setState({finalPlaylistLINK: data.external_urls.spotify})
            })


        // add items to said playlist


        // change state to display playlist
        this.setState({currentPage: "playlist"})
    }




    doGetPlaylistSongs = async (song: String) => {
        const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
        const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";

        // DOING JUST track FOR NOW
        var seedTrack = "seed_tracks=" + song
        
        // API Access Token
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        // call to get token, and update value
        const result = await fetch('https://accounts.spotify.com/api/token', authParameters);
        const data = await result.json();
        const accessToken = data.access_token;
        // const accessToken = localStorage.getItem('access_token');
        // console.log(accessToken)

        // GET request using /reccomendation to get array of Tracks
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        // var recs = await fetch('https://api.spotify.com/v1/reccomendation?seed_artists=' + seedArtist + '&seed_tracks=' + seedTrack, searchParameters)    
        var spotifyRecs = await fetch('https://api.spotify.com/v1/recommendations?' + seedTrack + '&limit=20', searchParameters)    
            .then(response => response.json())
            // .then(data => console.log(data))  // FOR QUERY TESTING
            .then(data => {
                // get list response
                const spotifyRecs = data.tracks
                // get current array
                const array = this.state.playlistSongs
                
                for (var i = 0; i < spotifyRecs.length; i++ ){
                    array.push(data.tracks[i])
                    console.log(data.tracks[i].id + " success") // TEST
                    console.log(data.tracks[i] + "result")
                }

                console.log("TEST")
                console.log(array)

                this.setState({playlistSongs: array})})
    }


}



