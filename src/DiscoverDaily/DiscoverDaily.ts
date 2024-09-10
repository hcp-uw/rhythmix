import { clientId } from "../spotify";

type playlistInfo = {genre_seed: string, link: string};

interface Track {
  href: string;
  name: string;
  uri: string;
};

interface Playlist {
  track: Track;
};

interface PlaylistResponse {
  items: Playlist[];
};

interface RecommendationResponse {
  tracks: Track[];
};

// Might have to store SpotiBlend tokens in a file and read/write to file
let access_token = "";
let refresh_token = "";

export const genreToPlaylistMap = new Map<string, playlistInfo>([
  ["Pop", {genre_seed: "pop", link: "https://open.spotify.com/embed/playlist/2sTcvjcZasAQwlgDrVprbD?utm_source=generator"}],
  ["Hip-Hop", {genre_seed: "hip-hop", link: "https://open.spotify.com/embed/playlist/2AF0jOomrpvwo81QdCiTB9?utm_source=generator"}],
  ["Indie", {genre_seed: "indie", link: "https://open.spotify.com/embed/playlist/0aLJwR85YiVpuf2Udmn6Ti?utm_source=generator"}],
  ["R&B",  {genre_seed: "r-n-b", link: "https://open.spotify.com/embed/playlist/0osjfZWfYKvLd7RtsIqu4T?utm_source=generator"}],
  // TODO: add other genres
]);

export const updatePlaylists = async () => {
  const tokens = await getAccessToken();
  access_token = tokens.access_token;
  refresh_token = tokens.refresh_token;
  getPlaylistItems();
};

const getAccessToken = async () => {
  const fetch_url = "https://accounts.spotify.com/api/token";
  const response = await fetch(fetch_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    })
  });
  return await response.json();
};

type trackURI = {uri: string};

const getPlaylistItems = (): void => {
  for (const playlist_info of genreToPlaylistMap.values()) {
    let result: string[] = playlist_info.link.split('/playlist/');
    const playlist_id = result[1].split('?')[0];
    const genre_seed = playlist_info.genre_seed;

    const fetch_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?fields=items%28added_by.id%2C+track%28name%2C+href%2C+uri%29%29&limit=25&offset=0`;
    fetch(fetch_url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then((res) => generalResp(res, "getPlaylistItems", playlist_id, genre_seed))
      .catch(() => generalError("getPlaylistItems fetch failed"));
  }
};

const getPlaylistItemsJson = (data: PlaylistResponse, playlist_id: string, genre_seed: string): void => {
  const track_uris: trackURI[] = [];
  for (const item of data.items) {
    track_uris.push({"uri": item.track.uri});
  }
  removeTracks(track_uris, playlist_id, genre_seed);
};

const removeTracks = (track_uris: trackURI[], playlist_id: string, genre_seed: string): void => {
  if (track_uris.length === 0) {
    getRecommendations(playlist_id, genre_seed);
  } else {
    const fetch_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
    fetch(fetch_url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'tracks': track_uris,
      }),
    }).then((res) => generalResp(res, "removeTracks", playlist_id, genre_seed))
      .catch(() => generalError("removeTracks fetch failed"))
  }
};

const removeTracksJson = (data: unknown, playlist_id: string, genre_seed: string): void => {
  getRecommendations(playlist_id, genre_seed);
};

const getRecommendations = (playlist_id: string, genre_seed: string): void => {
  const popularity = Math.floor(Math.random() * 100) + 1;
  const fetch_url = `https://api.spotify.com/v1/recommendations?limit=25&market=US&seed_genres=${genre_seed}&target_popularity=${popularity}`;
  fetch(fetch_url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  }).then((res) => generalResp(res, "getRecommendations", playlist_id, genre_seed))
    .catch(() => generalError("getRecommendations fetch failed"))
};

const getRecommendationsJson = (data: RecommendationResponse, playlist_id: string, genre_seed: string): void => {
  const track_uris: string[] = [];
  for (const track of data.tracks) {
    track_uris.push(track.uri);
  }
  addTracks(track_uris, playlist_id, genre_seed);
};

const addTracks = (track_uris: string[], playlist_id: string, genre_seed: string): void => {
  const fetch_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
  fetch(fetch_url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'uris': track_uris,
    }),
  }).then((res) => generalResp(res, "addTracks", playlist_id, genre_seed))
    .catch(() => generalError("addTracks fetch failed"))
};

const addTracksJson = (data: unknown, playlist_id: string, genre_seed: string): void => {};

const generalResp = (res: Response, function_name: string, playlist_id: string, genre_seed: string): void => {
  if (res.status === 200 || res.status === 201) {
    res.json().then((data) => eval(function_name + "Json(data, playlist_id, genre_seed)"))
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
// export const deletePlaylistsClick = () => {
//   fetch('https://api.spotify.com/v1/me/playlists?limit=25&offset=0', {
//     method: 'GET',
//     headers: {
//       'Authorization': 'Bearer ' + access_token
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
//       'Authorization': 'Bearer ' + access_token
//     }
//   }).then(deletePlaylistHelperResp)
//     .catch(() => generalError("deletePlaylistHelper fetch failed"));
// };

// const deletePlaylistHelperResp = (res: Response): void => {
//   if (res.status !== 200) {
//     generalError('Bad status code: ' + res.status);
//   }
// };
