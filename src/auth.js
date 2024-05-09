import { client_id, client_secret } from './keys.js';

// export async function auth_pkce() {
//     // Spotify API parameters
//     const redirectUri = 'http://localhost:3000';
//     const scope = 'user-read-private user-read-email playlist-modify-public';
//     const authorizationEndpoint = "https://accounts.spotify.com/authorize";

//     // Generate a random string for code verifier
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const randomValues = crypto.getRandomValues(new Uint8Array(64));
//     const codeVerifier = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

//     // SHA-256 hashing function
//     const data = new TextEncoder().encode(codeVerifier);
//     const hashed = await crypto.subtle.digest('SHA-256', data);
//     // Generate code challenge
//     const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hashed)))
//         .replace(/=/g, '')
//         .replace(/\+/g, '-')
//         .replace(/\//g, '_');

//     // Store code verifier in sessionStorage
//     window.localStorage.setItem('code_verifier', codeVerifier);

//     // Construct authorization URL
//     const authUrl = new URL(authorizationEndpoint);

//     const params = {
//         response_type: 'code',
//         client_id: client_id,
//         scope: scope,
//         code_challenge_method: 'S256',
//         code_challenge: codeChallenge,
//         redirect_uri: redirectUri,
//     };
    
//     authUrl.search = new URLSearchParams(params).toString();

//     // Redirect user to authorization URL
//     window.location.href = authUrl.toString();

//     // Retrieve authorization code from redirect
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');

//     // Exchange authorization code for access token
//     const getToken = async (code) => {
//         const codeVerifier = localStorage.getItem('code_verifier');
//         const tokenEndpoint = "https://accounts.spotify.com/api/token";

//         const payload = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: new URLSearchParams({
//                 client_id: client_id,
//                 grant_type: 'authorization_code',
//                 code: code,
//                 redirect_uri: redirectUri,
//                 code_verifier: codeVerifier,
//             }),
//         };

//         const response = await fetch(tokenEndpoint, payload);

//         const data = await response.json();
//         localStorage.setItem('access_token', data.access_token);
//     };

//     getToken(code);
// }

export var scope = 'user-read-private user-read-email playlist-modify-public';

var redirect_uri;
const stored_uri = localStorage.getItem("redirect_uri");
if (stored_uri === null) {
    redirect_uri = 'http://localhost:3000';
} else {
    redirect_uri = stored_uri;
    localStorage.removeItem("redirect_uri");
}
export {redirect_uri};

var access_token = null;
var refresh_token = null;

const TOKEN = "https://accounts.spotify.com/api/token";
export const AUTHORIZE = "https://accounts.spotify.com/authorize";

document.addEventListener("DOMContentLoaded", onPageLoad);

function onPageLoad() {
    access_token = localStorage.getItem("access_token");
}

export function auth_pkce() {
    localStorage.setItem("redirect_uri", redirect_uri); // Stores optional redirect uri so if the redirect is changed, the 
                                                        // next time this page is loaded that uri is used

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=" + scope;
    window.location.href = url; // Show Spotify's authorization screen

    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect_uri); // remove param from url

    return access_token;
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get("code");
    }
    return code;
}

function fetchAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa(client_id + ":" + client_secret)
    );
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    if (this.status === 200) { 
        var data = JSON.parse(this.responseText);
        if (data.access_token !== undefined) {
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token !== undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        alert(data.access_token)
    } else {
        alert(this.status);
    }
}



