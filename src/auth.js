// export const auth_pkce = async () => {
//   // start code challenge generation

//   const generateRandomString = (length) => {
//       const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//       const values = crypto.getRandomValues(new Uint8Array(length));
//       return values.reduce((acc, x) => acc + possible[x % possible.length], "");
//   }

//   const codeVerifier = generateRandomString(64);

//   const sha256 = async (plain) => {
//       const encoder = new TextEncoder()
//       const data = encoder.encode(plain)
//       return window.crypto.subtle.digest('SHA-256', data)
//   }

//   const base64encode = (input) => {
//       return btoa(String.fromCharCode(...new Uint8Array(input)))
//         .replace(/=/g, '')
//         .replace(/\+/g, '-')
//         .replace(/\//g, '_');
//   }

//   const hashed = await sha256(codeVerifier)
//   const codeChallenge = base64encode(hashed);

//   // end code challenge generation



//   // start request user authorization

//   const clientId = "e910cd42af954cd39b2e04cb4a1a43c3";
//   const redirectUri = 'http://localhost:3000';
//   //const redirectUri = 'http://127.0.0.1:5500/index.html';

//   const scope = 'user-read-private user-read-email';
//   const authUrl = new URL("https://accounts.spotify.com/authorize")

//   // generated in the previous step
//   window.localStorage.setItem('code_verifier', codeVerifier);

//   const params =  {
//     response_type: 'code',
//     client_id: clientId,
//     scope: scope,
//     code_challenge_method: 'S256',
//     code_challenge: codeChallenge,
//     redirect_uri: redirectUri,
//   }

//   authUrl.search = new URLSearchParams(params).toString();
//   window.location.href = authUrl.toString();

//   const urlParams = new URLSearchParams(window.location.search);
//   let code = await urlParams.get('code');

//   const getToken = async (code) => {

//       // stored in the previous step
//       let codeVerifier = localStorage.getItem('code_verifier');
    
//       const payload = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           client_id: clientId,
//           grant_type: 'authorization_code',
//           code: code,
//           redirect_uri: redirectUri,
//           code_verifier: codeVerifier,
//         }),
//       }
    
//       const body = await fetch("https://accounts.spotify.com/api/token", payload);
//       const response = await body.json();

//       return response.access_token;

//   }

//   const access_token = await getToken(code);

//   return access_token;
// }

export async function auth_pkce() {
  // Generate a random string for code verifier
  const generateRandomString = (length) => {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from(crypto.getRandomValues(new Uint8Array(length)))
          .map((x) => possible[x % possible.length])
          .join('');
  };

  const codeVerifier = generateRandomString(64);

  // SHA-256 hashing function
  const sha256 = async (plain) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hashBuffer))
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('');
  };

  // Base64 encoding function
  const base64encode = (input) => btoa(String.fromCharCode.apply(null, new Uint8Array(input)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  // Generate code challenge
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(new TextEncoder().encode(hashed));

  // Spotify API parameters
  const clientId = "e910cd42af954cd39b2e04cb4a1a43c3";
  const redirectUri = 'http://localhost:3000';
  const scope = 'user-read-private user-read-email';
  const authorizationEndpoint = 'https://accounts.spotify.com/authorize';
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  // Store code verifier in sessionStorage
  sessionStorage.setItem('code_verifier', codeVerifier);

  // Construct authorization URL
  const authUrl = new URL(authorizationEndpoint);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('redirect_uri', redirectUri);

  // Redirect user to authorization URL
  window.location.href = authUrl.toString();

  // Retrieve authorization code from redirect
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  // Exchange authorization code for access token
  const getToken = async () => {
      const codeVerifier = sessionStorage.getItem('code_verifier');

      const payload = new URLSearchParams();
      payload.append('client_id', clientId);
      payload.append('grant_type', 'authorization_code');
      payload.append('code', code);
      payload.append('redirect_uri', redirectUri);
      payload.append('code_verifier', codeVerifier);

      const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: payload,
      });

      const data = await response.json();
      return data.access_token;
  };

  return getToken();
}