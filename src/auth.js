export async function auth_pkce() {
    // Spotify API parameters
    const clientId = 'e910cd42af954cd39b2e04cb4a1a43c3';
    const redirectUri = 'http://localhost:3000';
    const scope = 'user-read-private user-read-email playlist-modify-public';
    const authorizationEndpoint = "https://accounts.spotify.com/authorize";

    // Generate a random string for code verifier
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const codeVerifier = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

    // SHA-256 hashing function
    const data = new TextEncoder().encode(codeVerifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);
    // Generate code challenge
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hashed)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    // Store code verifier in sessionStorage
    window.localStorage.setItem('code_verifier', codeVerifier);

    // Construct authorization URL
    const authUrl = new URL(authorizationEndpoint);

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };
    
    authUrl.search = new URLSearchParams(params).toString();

    // Redirect user to authorization URL
    window.location.href = authUrl.toString();

    // Retrieve authorization code from redirect
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Exchange authorization code for access token
    const getToken = async (code) => {
        const codeVerifier = localStorage.getItem('code_verifier');
        const tokenEndpoint = "https://accounts.spotify.com/api/token";

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        };

        const response = await fetch(tokenEndpoint, payload);

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
    };

    getToken(code);
}
