import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Container, InputGroup, FormControl, Button, Row, Col, Card } from 'react-bootstrap';
import { Spotify } from "react-spotify-embed";
import { accessTokenGLOBAL } from "../HomePage.tsx"
import { Root } from "react-dom/client";
import back_button from './back-button.png';
import home_button from './home-button.png';
import remove_button from './remove-button.png';
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
    currentPage: "home" | "searchbar" | "songlist" | "recommendations" | "playlist" | "getRecs";
    errorMessage: string;
    songResults: any[]; // current list of diplayed songs
    songMatchList: Song[];
    songRecommendations: any[];
    songRecommendationsLINK: String[];
    currID: any;
    playlistID: string;
    chosenSong: any;
    playlistSongs: Array<any>;
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
            playlistID: "",
            chosenSong: "",
            playlistSongs: [],
            finalPlaylistLINK: ""
            
        }
    }
    


    render = (): JSX.Element => {
        

        // if we're on start page
        if (this.state.currentPage === "home") {
            // render start page
            return (
              <div>
                {this.renderStartPage()}
              </div>
            );
        } else if (this.state.currentPage === "getRecs") {
    
            // CHANGE doAddSong to CREATE PLAYLIST
            return (
              <div>
                {this.renderRecsPage()};
              </div>
            );
            
        } else if (this.state.currentPage == "playlist") {
            // return (
            //     <div>
            //         <Spotify link={this.state.finalPlaylistLINK}></Spotify>
            //     </div>
            // );
            const timeout = async () => {
                console.log('a');
                console.log('waiting...')
                let delayres = await delay(5000);
                console.log('b');
            };
            const delay = (delayInms) => {
                return new Promise(resolve => setTimeout(resolve, delayInms));
            };

            timeout();

            console.log(this.state.finalPlaylistLINK)
            return <div className="SM-base">
                <h1 className="SM-header">your song match playlist</h1>
                <div className="SM-background">
                    <iframe className="embed-playlist" title="SM-result" src={this.state.finalPlaylistLINK}
                        width="100%"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy">
                    </iframe>
                </div>
                <button className="home-button-song-match" type="button" onClick={this.doHomeClick}><img className="button-image" alt="home" src={home_button} /></button>
            </div>;
        } else {
            return (
                <div>other page</div>
            );
        }
    }

    renderStartPage = (): JSX.Element => {
      return (
        <div className="SM-base">
          <h1 className="SM-header">song match</h1>
          <div className="SM-background"> 
            <InputGroup className="search-bar" size="lg">
              <FormControl
                placeholder="Search for a song or artist"
                type="input"
                onKeyUp={event => {
                if (event.key === "Enter") {
                    this.searchSong();
                }
                }}
                onChange={this.doSearchChange}
                className="search-input"
              />
              <button className="search-button" onClick={() => this.searchSong()}> Search </button>
            </InputGroup>    

            <Container className="song-container-search"> 
              {this.state.songResults.map( (song, i) => {
                return (
                <Card className="album-card" onClick={() => this.doAddSong(song.name, song.album.images[0].url, song.id, song.artists)}>
                  <Card.Img src={song.album.images[0].url}/>
                  <Card.Body>
                  <Card.Title>{song.name}</Card.Title>
                  </Card.Body>
                </Card>
                )
              })}
            </Container>

            
            <div className="selected-text"> Selected Songs: </div>
            <div className="song-match-pool-container">
                {this.state.songMatchList.map( (song, i) => {
                    return (
                      <Card className="album-card-match-pool">
                          <Card.Img variant="top" className="remove-button" src={remove_button} onClick={() => this.doRemoveSong(song.name, song.image, song.id, song.artists)}/>
                          <Card.Img src={song.image}/>
                          <Card.Body>
                          <Card.Title>{song.name}</Card.Title>
                          </Card.Body>
                      </Card>
                    )
                })}
                <div>
                {this.state.songMatchList.length > 0 && <button className="recs-button" onClick={() => this.doSearchRecs(3, this.state.songMatchList)}>Get Recommendations</button>}
                </div>
            </div>
          </div>
          <button className="home-button-song-match" type="button" onClick={this.doHomeClick}><img className="button-image" alt="home" src={home_button} /></button>
        </div>);
    }

    renderRecsPage = (): JSX.Element => {
      return (
        <div className="SM-base">
          <h1 className="SM-header">song match</h1>
          <div className="SM-background"> 
                    
            <Container className="song-recommendation-container">
              {this.state.songRecommendations.map((song, i) => {
                console.log(song);
                return (
                  <div key={i} className="spotify-container">
                    <Spotify link={song.external_urls.spotify}/>       
                    <button className="create-playlist-button" onClick={() => this.doSetChosenSong(song)}>
                        Create Playlist
                    </button> 
                  </div>
                )
            })}
            </Container>
            
            <div className="selected-text-recs"> Selected Songs: </div>
            <div className="song-match-pool-container-recs">
                {this.state.songMatchList.map( (song, i) => {
                    return (
                      <Card className="album-card-match-pool">
                          <Card.Img src={song.image}/>
                          <Card.Body>
                          <Card.Title>{song.name}</Card.Title>
                          </Card.Body>
                      </Card>
                    )
                })}
              </div>
          </div>
          <button className="back-button-song-match" type="button" onClick={this.doBackClick}><img className="button-image" alt="back" src={back_button} /></button>
          <button className="home-button-song-match" type="button" onClick={this.doHomeClick}><img className="button-image" alt="home" src={home_button} /></button>
        </div>);
    }


    /**
     * SEARCH BAR TESTING
     */
    doSearchBarClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.setState({currentPage: "searchbar"})
    }

    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
      this.setState({currentPage: "home", songRecommendations: []});
    }

    /**
     * BACK BUTTON HANDLER FUNCTIONS
     */
    doHomeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
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
            const newSong: Song = {name: name, image: image, id: id, artists: artists};
            if (indexOf(this.state.songMatchList, newSong) === -1) {
              currList.push(newSong);
            }
            this.setState({songMatchList: currList});
        } else {
            alert("Maximum of 5 songs selected")
        }
    }

    doRemoveSong = (name: string, image: any, id: string, artists: string): void => {
      const song: Song = {name: name, image: image, id: id, artists: artists};
      const currList = this.state.songMatchList;
      const index = indexOf(this.state.songMatchList, song);
      if (index > -1) {
        currList.splice(index, 1);
      }
      this.setState({songMatchList: currList});
  }

    searchSong = async (): Promise<void> => {


        const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
        const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";

        
        const accessToken = accessTokenGLOBAL;

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
        var songID = await fetch('https://api.spotify.com/v1/search?q=' + this.state.currentSearch + '&type=track&limit=8', searchParameters)
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
        
        const accessToken = accessTokenGLOBAL;

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


    doGetUserID = async (): Promise<void> => {
        const accessToken = accessTokenGLOBAL;
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
            .then(
                // Pass the user ID to doSendID
                this.doSendID)
    }

    doSendID = (id: any): void => {
        this.doCreatePlaylist(id);
    }
    /**
     * Search AFTER choosing Recs
     */
    
    doSetChosenSong = async (song: any): Promise<void> => {
        this.setState({chosenSong: song});
        this.doGetUserID();
    }

    doCreatePlaylist = (id: any): void => {

        /*
        After the users clicked create playlist
        1. call doSearchRecs to find more songs based on how many match pool songs there are and how large the playlist will be
            2 in pool and 20 song playlist = 10 songs based on reccs from each song in pool
        2. Create playlist api call
            Spotify user authentication to create playlist for users account
        3. Add all reccomended songs
        */

        // console.log(song)

        // get list of recommendationSeed[]
            // call getRecommendation()
        // this.doGetPlaylistSongs(this.state.chosenSong.id);
        
        // state will update songRecommendations to be used for the playlist


        // API Access Token
        const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
        const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";

        const accessToken = accessTokenGLOBAL;

        const userID = id.id;

        const playlistParameters = {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
              'name': "Your New Song Match Playlist",
            }),
          };

        console.log("CURRENT USER + " + userID)
        // create the playlist based on songRecommendations
        fetch("https://api.spotify.com/v1/users/" + userID + "/playlists", playlistParameters)
            .then(response => response.json())
            .then(
                // this.doSendPlaylistID
                this.doSetPlaylist
            )
        
        this.doGetPlaylistSongs(this.state.chosenSong.id);
    }

    doSetPlaylist = (res: any) : void => {
        console.log(res)
        const playlist_id = res.id
        this.setState({playlistID: playlist_id})
        this.setState({finalPlaylistLINK : "https://open.spotify.com/embed/playlist/" + playlist_id})
    }

    doSendPlaylistID = (id: any): void => {
        this.doAddSongs(id);
    }

    doAddSongs = async (songRecs: any): Promise<void> => {

        const accessToken = accessTokenGLOBAL;

        // const track_uris = songRecs.tracks;

        const trackArray : string[] = []; 

        console.log(songRecs.tracks)

        for (var track of songRecs.tracks) {
            trackArray.push(track.uri);
        }

        // console.log(track_uris);
        console.log(trackArray);

        const playlistID = this.state.playlistID;

        console.log(playlistID);

        await fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/tracks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                'uris': trackArray, // Array of song URIs
            }),
        })
        
        // .then((res) => generalResp(res, "addTracks"))
        // .catch(() => generalError("addTracks fetch failed"))

        // change state to display playlist

        const timeout = async () => {
            console.log('a');
            console.log('waiting...')
            let delayres = await delay(5000);
            console.log('b');
        };
        const delay = (delayInms) => {
            return new Promise(resolve => setTimeout(resolve, delayInms));
        };

        timeout();
        
        this.setState({currentPage: "playlist"})
    }


    doGetPlaylistSongs = async (song: String) => {
        const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
        const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";

        // DOING JUST track FOR NOW
        var seedTrack = "seed_tracks=" + song
        

        const accessToken = accessTokenGLOBAL;

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
            .then(this.doAddSongs)
    }



    


}

// const generalResp = (res: Response, function_name: string): void => {
//     if (res.status === 200 || res.status === 201) {
//       res.json().then((data) => eval(function_name + "Json(data, playlist_id, genre_seed)"))
//         .catch((error) => generalError(error));
//     } else if (res.status === 401) {
//         alert('Bad or expired token');
//     } else if (res.status === 403) {
//         alert('Bad OAuth request');
//     } else if (res.status === 429) {
//         alert('App has exceeded rate limits'); 
//     } else {
//         generalError('Bad status code: ' + res.status);
//     }
// };

const generalError = (msg: string): void => {
alert(msg);
};


const indexOf = (songList: Song[], song: Song): number => {
  for (let i = 0; i < songList.length; i++) {
    if (JSON.stringify(songList[i]) === JSON.stringify(song)) {
      return i;
    }
  }
  return -1;
};
