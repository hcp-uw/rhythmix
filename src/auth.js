import { client_id, client_secret } from './keys.js';

// AUTH PKCE FETCH ATTEMPT
// export async function auth_pkce() {
//     // Spotify API parameters
//     let redirectUri = 'http://localhost:3000/';
//     let scope = 'user-read-private user-read-email playlist-modify-public';
//     let authorizationEndpoint = "https://accounts.spotify.com/authorize";

//     // Generate a random string for code verifier
//     let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let randomValues = crypto.getRandomValues(new Uint8Array(64));
//     let codeVerifier = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

//     // SHA-256 hashing function
//     let data = new TextEncoder().encode(codeVerifier);
//     let hashed = await crypto.subtle.digest('SHA-256', data);
//     // Generate code challenge
//     let codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hashed)))
//         .replace(/=/g, '')
//         .replace(/\+/g, '-')
//         .replace(/\//g, '_');

//     // Store code verifier in sessionStorage
//     window.localStorage.setItem('code_verifier', codeVerifier);

//     // letruct authorization URL
//     let authUrl = new URL(authorizationEndpoint);

//     let params = {
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
//     let urlParams = new URLSearchParams(window.location.search);
//     let code = urlParams.get('code');

//     // Exchange authorization code for access token
//     let getToken = async (code) => {
//         let codeVerifier = localStorage.getItem('code_verifier');
//         let tokenEndpoint = "https://accounts.spotify.com/api/token";

//         let payload = {
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

//         let response = await fetch(tokenEndpoint, payload);

//         let data = await response.json();
//         localStorage.setItem('access_token', data.access_token);
//     };

//     getToken(code);
// }

// // AUTH PKCE XML ATTEMPT
// export var scope = 'user-read-private user-read-email playlist-modify-public';

// var redirect_uri;
// let stored_uri = localStorage.getItem("redirect_uri");
// if (stored_uri === null) {
//     redirect_uri = 'http://localhost:3000/';
// } else {
//     redirect_uri = stored_uri;
//     localStorage.removeItem("redirect_uri");
// }
// export {redirect_uri};

// var access_token = null;
// var refresh_token = null;

// let TOKEN = "https://accounts.spotify.com/api/token";
// export let AUTHORIZE = "https://accounts.spotify.com/authorize";

// document.addEventListener("DOMContentLoaded", onPageLoad);

// function onPageLoad() {
//     access_token = localStorage.getItem("access_token");
// }

// export async function auth_pkce() {
//     localStorage.setItem("redirect_uri", redirect_uri); // Stores optional redirect uri so if the redirect is changed, the 
//                                                         // next time this page is loaded that uri is used

//     let url = AUTHORIZE;
//     url += "?client_id=" + client_id;
//     url += "&response_type=code";
//     url += "&redirect_uri=" + encodeURI(redirect_uri);
//     url += "&show_dialog=true";
//     url += "&scope=" + scope;
//     window.location.href = url; // Show Spotify's authorization screen

//     getCode().then(() => fetchAccessToken);
//     window.history.pushState("", "", redirect_uri); // remove param from url
// }

// async function getCode() {
//     let code = null;
//     let queryString = window.location.search;
//     if (queryString.length > 0) {
//         let urlParams = new URLSearchParams(queryString);
//         code = urlParams.get("code");
//     }
//     return code;
// }

// async function fetchAccessToken(code) {
//     let body = "grant_type=authorization_code";
//     body += "&code=" + code;
//     body += "&redirect_uri=" + encodeURI(redirect_uri);
//     body += "&client_id=" + client_id;
//     body += "&client_secret=" + client_secret;
//     callAuthorizationApi(body);
// }

// function callAuthorizationApi(body) {
//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", TOKEN, true);
//     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//     xhr.setRequestHeader(
//         "Authorization",
//         "Basic " + btoa(client_id + ":" + client_secret)
//     );
//     xhr.send(body);
//     xhr.onload = handleAuthorizationResponse;
// }

// function handleAuthorizationResponse() {
//     if (this.status === 200) { 
//         var data = JSON.parse(this.responseText);
//         if (data.access_token !== undefined) {
//             access_token = data.access_token;
//             localStorage.setItem("access_token", access_token);
//         }
//         if (data.refresh_token !== undefined) {
//             refresh_token = data.refresh_token;
//             localStorage.setItem("refresh_token", refresh_token);
//         }
//     } else {
//         alert(this.status);
//     }
// }
export function auth_pkce() {
    let redirect_uri = "http://localhost:3000/callback";
    let scope = "playlist-modify-private playlist-modify-public user-read-private";
    let state = "temp_state"; // TODO: CHANGE LATER TO RANDOM GEN
    let authUrl = new URL("https://accounts.spotify.com/authorize");
    

    let params = {
        client_id: client_id,
        response_type: "code",
        redirect_uri: redirect_uri,
        state: state,
        scope: scope,
    };

    authUrl.search = new URLSearchParams(params).toString();

    setTimeout(function() {
        window.location.href = authUrl.toString();
    }, 5000);
    
    let urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    // let answer_state = urlParams.get("state");

    // if (answer_state !== state) {
    //     alert("Insecure state " + answer_state);
    //     return;
    // }

    let tokenEndpoint = "https://accounts.spotify.com/api/token";

    let payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirect_uri,
        }),
    };

    fetch(tokenEndpoint, payload).then(res => res.json())
                                 .then(res => {
                                    localStorage.setItem('access_token', res.access_token);
                                    localStorage.setItem('refresh_token', res.refresh_token);
                                })
                                 .catch(error => console.error(error));
}
