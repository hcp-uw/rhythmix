export const genreToPlaylistMap = new Map<string, string>([
  ["Pop", "https://open.spotify.com/embed/playlist/2sTcvjcZasAQwlgDrVprbD?utm_source=generator"],
  ["Hip-Hop", "https://open.spotify.com/embed/playlist/2AF0jOomrpvwo81QdCiTB9?utm_source=generator"],
  ["Indie", "https://open.spotify.com/embed/playlist/0aLJwR85YiVpuf2Udmn6Ti?utm_source=generator"],
  ["R&B", "https://open.spotify.com/embed/playlist/0osjfZWfYKvLd7RtsIqu4T?utm_source=generator"],
  // TODO: add other genres
]);

export const updatePlaylistsClick = () => {
  // Check when a playlist was last updated
  // If made 1 day ago (yesterday), loop through every playlist, remove every song
  // Find 25 songs for each playlist, algo needed:
  // console.log(Date());

  /*
  1. loop through every playlist in genretoplaylist map value, parsing the id
  2. for every id:
      remove every song
      make recommendations (some algo needed)

  */

  getPlaylistItems();
};

type trackURI = {uri: string};

const getPlaylistItems = (): void => {
  // replace middle with playlist id of all playlists
  const fetch_url = "https://api.spotify.com/v1/playlists/0osjfZWfYKvLd7RtsIqu4T/tracks?fields=items%28added_by.id%2C+track%28name%2C+href%2C+uri%29%29&limit=25&offset=0";
  fetch(fetch_url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
  }).then((res) => generalResp(res, "getPlaylistItems"))
    .catch(() => generalError("getPlaylistItems fetch failed"))
};

const getPlaylistItemsJson = (data: unknown): void => {
  const track_uris: trackURI[] = [];
  for (const item of data.items) {
    track_uris.push({"uri": item.track.uri});
  }
  removeTracks(track_uris);
};

const removeTracks = (track_uris: trackURI[]): void => {
  const fetch_url = "https://api.spotify.com/v1/playlists/0osjfZWfYKvLd7RtsIqu4T/tracks";
  fetch(fetch_url, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'tracks': track_uris,
      'snapshot_id': "AAAABySZdDn6DsZ3Lskk9070c0EuUOCi"
    }),
  }).then((res) => generalResp(res, "removeTracks"))
    .catch(() => generalError("removeTracks fetch failed"))
};

const removeTracksJson = (data: unknown): void => {
  getRecommendations();
};

const getRecommendations = (): void => {
  const popularity = Math.floor(Math.random() * 100) + 1;
  const fetch_url = `https://api.spotify.com/v1/recommendations?limit=25&market=US&seed_genres=r-n-b&target_popularity=${popularity}`;
  fetch(fetch_url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
  }).then((res) => generalResp(res, "getRecommendations"))
    .catch(() => generalError("getRecommendations fetch failed"))
};

const getRecommendationsJson = (data: unknown): void => {
  const track_uris: string[] = [];
  for (const track of data.tracks) {
    track_uris.push(track.uri);
  }
  addTracks(track_uris);
};

const addTracks = (track_uris: string[]): void => {
  const fetch_url = "https://api.spotify.com/v1/playlists/0osjfZWfYKvLd7RtsIqu4T/tracks";
  fetch(fetch_url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'uris': track_uris,
    }),
  }).then((res) => generalResp(res, "addTracks"))
    .catch(() => generalError("addTracks fetch failed"))
};

const addTracksJson = (data: unknown): void => {
  window.location.href = 'http://localhost:3000';
};

const generalResp = (res: Response, function_name: string): void => {
  if (res.status === 200 || res.status === 201) {
    res.json().then((data) => eval(function_name + "Json(data)"))
      .catch((error) => generalError(error));
  } else if (res.status === 401) {
      alert('Bad or expired token');
  } else if (res.status === 403) {
      alert('Bad OAuth request');
  } else if (res.status === 429) {
      alert('App has exceeded rate limits'); 
  } else {
      generalError('Bad status code: ' + res.status);
  }
};

const generalError = (msg: string): void => {
  alert(msg);
};

// Delete playlists created through custom playlist and song match
// export const deletePlaylists = () => {
//   fetch('https://api.spotify.com/v1/me/playlists?limit=25&offset=0', {
//     method: 'GET',
//     headers: {
//       'Authorization': 'Bearer ' + localStorage.getItem('access_token')
//     }
//   }).then((res) => generalResp(res, "deletePlaylists"))
//     .catch(() => generalError("deletePlaylists fetch failed"));
// };

// const deletePlaylistsJson = (data: unknown): void => {
//   for (const item of data.items) {
//     if (item.name === "Your New Custom Playlist") {
//       deletePlaylistHelper(item.id);
//     }
//   }
// };

// const deletePlaylistHelper = (id: string): void => {
//   const fetch_url = "https://api.spotify.com/v1/playlists/" + id + "/followers";
//   fetch(fetch_url, {
//     method: 'DELETE',
//     headers: {
//       'Authorization': 'Bearer ' + localStorage.getItem('access_token')
//     }
//   }).then(deletePlaylistHelperResp)
//     .catch(() => generalError("deletePlaylistHelper fetch failed"));
// };

// const deletePlaylistHelperResp = (res: Response): void => {
//   if (res.status !== 200) {
//     generalError('Bad status code: ' + res.status);
//   }
// };
