"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlaylists = void 0;
const mongodb_1 = require("mongodb");
;
;
;
;
;
const genreToPlaylistMap = new Map([
    ["Pop", { genre_seed: "pop", link: "https://open.spotify.com/embed/playlist/6WZx6JODAeplGmQL7YBXfK?utm_source=generator" }],
    ["Hip-Hop", { genre_seed: "hip-hop", link: "https://open.spotify.com/embed/playlist/5n9846Hwm6OsDicJ5a0v6f?utm_source=generator" }],
    ["Indie", { genre_seed: "indie", link: "https://open.spotify.com/embed/playlist/1JHl3qS08VD8Qcb0pfqGU3?utm_source=generator" }],
    ["R&B", { genre_seed: "r-n-b", link: "https://open.spotify.com/embed/playlist/2ooZlUQuH5xNgrJkD1dpe5?utm_source=generator" }],
    ["EDM", { genre_seed: "edm", link: "https://open.spotify.com/embed/playlist/0T0JF0dPzzczmQ3hV9x2q5?utm_source=generator" }],
    ["Romance", { genre_seed: "romance", link: "https://open.spotify.com/embed/playlist/6vGCq5o22Q2o351Nim1TLJ?utm_source=generator" }],
    ["K-pop", { genre_seed: "k-pop", link: "https://open.spotify.com/embed/playlist/37A4pqUHFQwR1GqNZI8qII?utm_source=generator" }],
    ["Workout", { genre_seed: "work-out", link: "https://open.spotify.com/embed/playlist/5W8GJqJ4GaJ3NkEOrjTRSf?utm_source=generator" }]
]);
const clientId = process.env.REACT_APP_CLIENT_ID || 'default';
const uri = process.env.REACT_APP_MONGODB_URI || 'default';
const objectId = process.env.REACT_APP_MONGODB_OBJECT_ID || 'default';
const client = new mongodb_1.MongoClient(uri);
const getRefreshToken = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const database = client.db("tokens");
        const collection = database.collection("refreshToken");
        const token_doc = yield collection.findOne(filter);
        if (token_doc && token_doc.refresh_token) {
            return token_doc.refresh_token;
        }
        else {
            return "";
        }
    }
    catch (error) {
        console.error("Error retrieving refresh token: ", error);
        return "";
    }
    finally {
        yield client.close();
    }
});
const updateRefreshToken = (filter, newToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const database = client.db("tokens");
        const collection = database.collection("refreshToken");
        const updateDoc = {
            $set: {
                refresh_token: newToken,
            },
        };
        const result = yield collection.updateOne(filter, updateDoc);
        return result.modifiedCount > 0;
    }
    catch (error) {
        console.error("Error updating refresh_token:", error);
        return false;
    }
    finally {
        yield client.close();
    }
});
const updatePlaylists = () => __awaiter(void 0, void 0, void 0, function* () {
    const filter = { _id: new mongodb_1.ObjectId(objectId) }; // Replace with your filter criteria
    let refresh_token = yield getRefreshToken(filter);
    console.log("old refresh token: " + refresh_token);
    const tokens = yield getAccessToken(refresh_token);
    refresh_token = tokens.refresh_token;
    console.log("new refresh token : " + refresh_token);
    const updateSuccess = yield updateRefreshToken(filter, refresh_token);
    if (updateSuccess) {
        console.log("updated token successfully");
    }
    if (tokens.access_token) {
        yield getPlaylistItems(tokens.access_token);
    }
});
exports.updatePlaylists = updatePlaylists;
const getAccessToken = (refresh_token) => __awaiter(void 0, void 0, void 0, function* () {
    const fetch_url = "https://accounts.spotify.com/api/token";
    const response = yield fetch(fetch_url, {
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
    return yield response.json();
});
const getPlaylistItems = (access_token) => __awaiter(void 0, void 0, void 0, function* () {
    for (const playlist_info of genreToPlaylistMap.values()) {
        let result = playlist_info.link.split('/playlist/');
        const playlist_id = result[1].split('?')[0];
        const genre_seed = playlist_info.genre_seed;
        const fetch_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?fields=items%28added_by.id%2C+track%28name%2C+href%2C+uri%29%29&limit=25&offset=0`;
        try {
            const response = yield fetch(fetch_url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            });
            yield generalResp(response, "getPlaylistItems", playlist_id, genre_seed, access_token);
        }
        catch (_a) {
            generalError("getPlaylistItems fetch failed");
        }
    }
});
const getPlaylistItemsJson = (data, playlist_id, genre_seed, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    const track_uris = [];
    for (const item of data.items) {
        track_uris.push({ "uri": item.track.uri });
    }
    yield removeTracks(track_uris, playlist_id, genre_seed, access_token);
});
const removeTracks = (track_uris, playlist_id, genre_seed, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    if (track_uris.length === 0) {
        yield getRecommendations(playlist_id, genre_seed, access_token);
    }
    else {
        try {
            const fetch_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
            const response = yield fetch(fetch_url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'tracks': track_uris,
                }),
            });
            yield generalResp(response, "removeTracks", playlist_id, genre_seed, access_token);
        }
        catch (_b) {
            generalError("removeTracks fetch failed");
        }
    }
});
const removeTracksJson = (data, playlist_id, genre_seed, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    yield getRecommendations(playlist_id, genre_seed, access_token);
});
const getRecommendations = (playlist_id, genre_seed, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    const popularity = Math.floor(Math.random() * 100) + 1;
    try {
        const fetch_url = `https://api.spotify.com/v1/recommendations?limit=25&market=US&seed_genres=${genre_seed}&target_popularity=${popularity}`;
        const response = yield fetch(fetch_url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        });
        yield generalResp(response, "getRecommendations", playlist_id, genre_seed, access_token);
    }
    catch (_c) {
        generalError("getRecommendations fetch failed");
    }
});
const getRecommendationsJson = (data, playlist_id, genre_seed, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    const track_uris = [];
    for (const track of data.tracks) {
        track_uris.push(track.uri);
    }
    yield addTracks(track_uris, playlist_id, genre_seed, access_token);
});
const addTracks = (track_uris, playlist_id, genre_seed, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetch_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
        const response = yield fetch(fetch_url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'uris': track_uris,
            }),
        });
        yield generalResp(response, "addTracks", playlist_id, genre_seed, access_token);
    }
    catch (_d) {
        generalError("addTracks fetch failed");
    }
});
const addTracksJson = (data, playlist_id, genre_seed, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("tracks added successfully");
});
const generalResp = (res, function_name, playlist_id, genre_seed, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.status === 200 || res.status === 201) {
        if (function_name === "getPlaylistItems") {
            res.json().then((data) => getPlaylistItemsJson(data, playlist_id, genre_seed, access_token))
                .catch((error) => generalError(error));
        }
        else if (function_name === "removeTracks") {
            res.json().then((data) => removeTracksJson(data, playlist_id, genre_seed, access_token))
                .catch((error) => generalError(error));
        }
        else if (function_name === "getRecommendations") {
            res.json().then((data) => getRecommendationsJson(data, playlist_id, genre_seed, access_token))
                .catch((error) => generalError(error));
        }
        else if (function_name === "addTracks") {
            res.json().then((data) => addTracksJson(data, playlist_id, genre_seed, access_token))
                .catch((error) => generalError(error));
        }
    }
    else if (res.status === 401) {
        console.log('Bad or expired token');
    }
    else if (res.status === 403) {
        console.log('Bad OAuth request');
    }
    else if (res.status === 429) {
        console.log('App has exceeded rate limits');
    }
    else {
        generalError('Bad status code: ' + res.status);
    }
});
const generalError = (msg) => {
    console.log(msg);
};
