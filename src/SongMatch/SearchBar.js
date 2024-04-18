import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';


const CLIENT_ID = "e910cd42af954cd39b2e04cb4a1a43c3";
const CLIENT_SECRET = "2e5b8f0e3f464084bd3546d5dad312c5";

function SearchBar() {
  // the input in the search bar, and the function to update the search bar
  const [ searchInput, setSearchInput ] = useState("");
  // access token, and the function to update the token
  const [ accessToken, setAccessToken ] = useState("");
  // stores current list of albums
  const [ albums, setAlbums ] = useState([]);

  // how we run initializing of spotify api
  // runs once when starting react app
  useEffect(() => {
    // API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    // call to get token, and update value
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])


  // Search Function
  // needs to be async if you have wait statements
  async function search() {
    console.log("Search for " + searchInput);

    // CALL TO SPOTIFY API SEARCH

    // GET request using Search to get Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id }) // saves artist id to artistID - gets most popular result


    // GET request with Artist ID, grab all albums from artist
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => { 
        console.log(data);
        setAlbums(data.items);  // stores the 50 albums as an array of records
      })


    // Display albums to user
  }

  console.log(albums);

  // Render UI
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search for Artist"
            type="input"
            onKeyUp={event => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={() => search()}>
            Search
          </Button>
        </InputGroup>
      </Container>

      <Container>
        <Row className="mx-2 row row-cols-4">
          
          {albums.map( (album, i) => {
            return (
              <Card>
                <Card.Img src={album.images[0].url}/>
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            )
          })}
  
        </Row>
        
      </Container>
    </div>
  );
}

export default SearchBar;
