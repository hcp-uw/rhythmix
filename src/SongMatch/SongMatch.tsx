import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Container, InputGroup, FormControl, Button, Row, Col, Card } from 'react-bootstrap';
import { Root } from "react-dom/client";
import './index.css';
import SearchBar from "./SearchBar";

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
    currentPage: "home" | "searchbar" | "songlist" | "recommendations" | "playlist";
    errorMessage: string;
    songResults: any[]; // current list of diplayed songs
    songMatchList: Song[];
    songRecommendations: string[];
    
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
            songRecommendations: []
            
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

        } else if (this.state.currentPage === "songlist") {
            
            return(
                <div/>
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

                {/* <Container>
                    <Row className="mx-2 row row-cols-6">
                    
                    {this.state.songResults.map( (song, i) => {
                        return (
                        <Card>
                            <Card.Img src={song.images[0].url}/>
                            <Card.Body>
                            <Card.Title>{song.name}</Card.Title>
                            </Card.Body>
                        </Card>
                        )
                    })}
            
                    </Row>
                </Container> */}

                <Container className="large-container">
                    <Row className="mx-2 row row-cols-6">
                    
                        {this.state.songResults.map( (song, i) => {
                            return (
                            <Card className="large-card">
                                <Card.Img src={song.album.images[0].url}/>
                                <Card.Body>
                                <Card.Title>{song.name}</Card.Title>
                                <button onClick={() => this.doAddSong(song.name, song.album.images[0].url, song.id, song.artists)}> + </button>
                                </Card.Body>
                            </Card>
                            )
                        })}
                    </Row>
                </Container>


                <Container className="mt-3">
                    <Row>
                        {this.state.songMatchList.map( (song, i) => {
                            return (
                            <Col md={2}>
                                <Card className="small-card">
                                    <Card.Img src={song.image}/>
                                    <Card.Body>
                                    <Card.Title>{song.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                            )
                        })}
                    </Row>

                    {this.state.songMatchList.length > 0 && <Button onClick={this.doSearchRecs}>Search</Button>}
                </Container>
                
                

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
        
        const currList = this.state.songMatchList;
        currList.push({name: name, image: image, id: id, artists: artists});
        this.setState({songMatchList: currList});
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
    doSearchRecs = (): void => {

        var recs: recommendationSeed[] = [];

        var reccTracks
        
        // create list of recs
        for (var i = 0; i < this.state.songMatchList.length; i++) {
            // stores current song
            const currSong: Song = this.state.songMatchList[i];

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
        this.getRecommendation()



        




        
        
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



    getRecommendation = async (seedArtist: string, seedTrack: string, numSongs: number): Promise<void> => {
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

        // GET request using /reccomendation to get array of Tracks
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        var recs = await fetch('https://api.spotify.com/v1/reccomendation?seed_artists=' + seedArtist + '&seed_tracks=' + seedTrack, searchParameters)
            .then(response => response.json())
            // .then(data => console.log(data))  // FOR QUERY TESTING
            .then(data => {
                // get list response
                const recs = data.tracks
                // get current array
                const array = this.state.songRecommendations
                
                for (var i = 0; i < numSongs; i++ ){
                    array.push(data.tracks[i])
                }
                this.setState.songRecommendations(array)}
                
        
    }




    /**
     * Search AFTER choosing Recs
     */
    doCreatePlaylist = (): void => {

        /*
        After the users clicked create playlist
        1. call doSearchRecs to find more songs based on how many match pool songs there are and how large the playlist will be
            2 in pool and 20 song playlist = 10 songs based on reccs from each song in pool
        2. Create playlist api call
            Spotify user authentication to create playlist for users account
        3. Add all reccomended songs
        */

        // search for songs based on the recommendation(s) they chose
        

        // create playlist



        // auth + spotify login
    }


}



