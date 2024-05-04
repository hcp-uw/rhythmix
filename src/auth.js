export const auth_pkce = async () => {
  // start code challenge generation

  const generateRandomString = (length) => {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }

  const codeVerifier = generateRandomString(64);

  const sha256 = async (plain) => {
      const encoder = new TextEncoder()
      const data = encoder.encode(plain)
      return window.crypto.subtle.digest('SHA-256', data)
  }

  const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
  }

  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);

  // end code challenge generation



  // start request user authorization

  const clientId = "e910cd42af954cd39b2e04cb4a1a43c3";
  const redirectUri = 'http://localhost:3000';
  //const redirectUri = 'http://127.0.0.1:5500/index.html';

  const scope = 'user-read-private user-read-email';
  const authUrl = new URL("https://accounts.spotify.com/authorize")

  // generated in the previous step
  window.localStorage.setItem('code_verifier', codeVerifier);

  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();

  const urlParams = new URLSearchParams(window.location.search);
  let code = await urlParams.get('code');

  const getToken = async (code) => {

      // stored in the previous step
      let codeVerifier = localStorage.getItem('code_verifier');
    
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
      }
    
      const body = await fetch("https://accounts.spotify.com/api/token", payload);
      const response = await body.json();

      return response.access_token;

  }

  const access_token = await getToken(code);

  return access_token;
}