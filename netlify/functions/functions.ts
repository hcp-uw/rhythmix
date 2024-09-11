
import { MongoClient, ObjectId } from "mongodb";

interface TokenDocument {
  _id: ObjectId;
  refresh_token: string;
};

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

type playlistInfo = {genre_seed: string, link: string};

type trackURI = {uri: string};

const genreToPlaylistMap = new Map<string, playlistInfo>([
  ["Pop", {genre_seed: "pop", link: "https://open.spotify.com/embed/playlist/6WZx6JODAeplGmQL7YBXfK?utm_source=generator"}],
  ["Hip-Hop", {genre_seed: "hip-hop", link: "https://open.spotify.com/embed/playlist/5n9846Hwm6OsDicJ5a0v6f?utm_source=generator"}],
  ["Indie", {genre_seed: "indie", link: "https://open.spotify.com/embed/playlist/1JHl3qS08VD8Qcb0pfqGU3?utm_source=generator"}],
  ["R&B",  {genre_seed: "r-n-b", link: "https://open.spotify.com/embed/playlist/2ooZlUQuH5xNgrJkD1dpe5?utm_source=generator"}],
  ["EDM", {genre_seed: "edm", link: "https://open.spotify.com/embed/playlist/0T0JF0dPzzczmQ3hV9x2q5?utm_source=generator"}],
  ["Romance", {genre_seed: "romance", link: "https://open.spotify.com/embed/playlist/6vGCq5o22Q2o351Nim1TLJ?utm_source=generator"}],
  ["K-pop", {genre_seed: "k-pop", link: "https://open.spotify.com/embed/playlist/37A4pqUHFQwR1GqNZI8qII?utm_source=generator"}],
  ["Alternative", {genre_seed: "alternative", link: "https://open.spotify.com/embed/playlist/4Hlej1tVLz2XU6RtChIurM?utm_source=generator"}],
  ["Workout", {genre_seed: "work-out", link: "https://open.spotify.com/embed/playlist/5W8GJqJ4GaJ3NkEOrjTRSf?utm_source=generator"}]
]);

// TODO: change to environmental variables
const clientId = "e910cd42af954cd39b2e04cb4a1a43c3";
const uri = "mongodb+srv://wlo12489:FRvfj2f6UZLGbvyl@spotiblend.l5fua.mongodb.net/?retryWrites=true&w=majority&appName=spotiblend";
const objectId = "66e0b24bcbb043bf94e6276b";
const client = new MongoClient(uri);

const getRefreshToken = async (filter: object): Promise<string> => {
  try {
    await client.connect();
    const database = client.db("tokens");
    const collection = database.collection<TokenDocument>("refreshToken");
    const token_doc = await collection.findOne(filter);
    if (token_doc && token_doc.refresh_token) {
      return token_doc.refresh_token;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error retrieving refresh token: ", error);
    return "";
  } finally {
    await client.close();
  }
};

const updateRefreshToken = async (filter: object, newToken: string): Promise<boolean> => {
  try {
    await client.connect();
    const database = client.db("tokens");
    const collection = database.collection<TokenDocument>("refreshToken");
    const updateDoc = {
      $set: {
        refresh_token: newToken,
      },
    };
    const result = await collection.updateOne(filter, updateDoc);
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating refresh_token:", error);
    return false;
  } finally {
    await client.close();
  }
};

export const updatePlaylists = async (): Promise<void> => {
  const filter = { _id: new ObjectId(objectId) }; // Replace with your filter criteria
  let refresh_token = await getRefreshToken(filter);
  console.log("old refresh token: " + refresh_token);
  const tokens = await getAccessToken(refresh_token);
  refresh_token = tokens.refresh_token;
  console.log("new refresh token : " + refresh_token);
  const updateSuccess = await updateRefreshToken(filter, refresh_token);
  if (updateSuccess) {
    console.log("updated token successfully");
  }
  if (tokens.access_token) {
    await getPlaylistItems(tokens.access_token);
  }
};

const getAccessToken = async (refresh_token: string) => {
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

const getPlaylistItems = async (access_token: string): Promise<void> => {
  for (const playlist_info of genreToPlaylistMap.values()) {
    let result: string[] = playlist_info.link.split('/playlist/');
    const playlist_id = result[1].split('?')[0];
    const genre_seed = playlist_info.genre_seed;
    const fetch_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?fields=items%28added_by.id%2C+track%28name%2C+href%2C+uri%29%29&limit=25&offset=0`;
    try {
      const response = await fetch(fetch_url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      });
      await generalResp(response, "getPlaylistItems", playlist_id, genre_seed, access_token);
    } catch {
      generalError("getPlaylistItems fetch failed")
    }
  }
};

const getPlaylistItemsJson = async (data: PlaylistResponse, playlist_id: string, genre_seed: string, access_token: string): Promise<void> => {
  const track_uris: trackURI[] = [];
  for (const item of data.items) {
    track_uris.push({"uri": item.track.uri});
  }
  await removeTracks(track_uris, playlist_id, genre_seed, access_token);
};

const removeTracks = async (track_uris: trackURI[], playlist_id: string, genre_seed: string, access_token: string): Promise<void> => {
  if (track_uris.length === 0) {
    await getRecommendations(playlist_id, genre_seed, access_token);
  } else {
    try {
      const fetch_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
      const response = await fetch(fetch_url, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'tracks': track_uris,
        }),
      });
      await generalResp(response, "removeTracks", playlist_id, genre_seed, access_token);
    } catch {
      generalError("removeTracks fetch failed");
    }
  }
};

const removeTracksJson = async (data: unknown, playlist_id: string, genre_seed: string, access_token: string): Promise<void> => {
  await getRecommendations(playlist_id, genre_seed, access_token);
};

const getRecommendations = async (playlist_id: string, genre_seed: string, access_token: string): Promise<void> => {
  const popularity = Math.floor(Math.random() * 100) + 1;
  try {
    const fetch_url = `https://api.spotify.com/v1/recommendations?limit=25&market=US&seed_genres=${genre_seed}&target_popularity=${popularity}`;
    const response = await fetch(fetch_url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    });
    await generalResp(response, "getRecommendations", playlist_id, genre_seed, access_token);
  } catch {
    generalError("getRecommendations fetch failed");
  }
};

const getRecommendationsJson = async (data: RecommendationResponse, playlist_id: string, genre_seed: string, access_token: string): Promise<void> => {
  const track_uris: string[] = [];
  for (const track of data.tracks) {
    track_uris.push(track.uri);
  }
  await addTracks(track_uris, playlist_id, genre_seed, access_token);
};

const addTracks = async (track_uris: string[], playlist_id: string, genre_seed: string, access_token: string): Promise<void> => {
  try {
    const fetch_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
    const response = await fetch(fetch_url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'uris': track_uris,
      }),
    });
    await generalResp(response, "addTracks", playlist_id, genre_seed, access_token);
  } catch {
    generalError("addTracks fetch failed");
  }
};

const addTracksJson = async (data: unknown, playlist_id: string, genre_seed: string, access_token: string): Promise<void> => {
  console.log("tracks added successfully");
};

const generalResp = async (res: Response, function_name: string, playlist_id: string, genre_seed: string, access_token: string): Promise<void> => {
  if (res.status === 200 || res.status === 201) {
    if (function_name === "getPlaylistItems") {
      res.json().then((data) => getPlaylistItemsJson(data, playlist_id, genre_seed, access_token))
      .catch((error) => generalError(error));
    } else if (function_name === "removeTracks") {
      res.json().then((data) => removeTracksJson(data, playlist_id, genre_seed, access_token))
      .catch((error) => generalError(error));
    } else if (function_name === "getRecommendations") {
      res.json().then((data) => getRecommendationsJson(data, playlist_id, genre_seed, access_token))
      .catch((error) => generalError(error));
    } else if (function_name === "addTracks") {
      res.json().then((data) => addTracksJson(data, playlist_id, genre_seed, access_token))
      .catch((error) => generalError(error));
    }
  } else if (res.status === 401) {
      console.log('Bad or expired token');
  } else if (res.status === 403) {
      console.log('Bad OAuth request');
  } else if (res.status === 429) {
      console.log('App has exceeded rate limits');
  } else {
      generalError('Bad status code: ' + res.status);
  }
};

const generalError = (msg: string): void => {
  console.log(msg);
};
