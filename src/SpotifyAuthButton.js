import React from 'react';

const SpotifyAuthButton = () => {
    const clientId = 'e910cd42af954cd39b2e04cb4a1a43c3';
    const redirectUri = 'http://localhost:3000/callback';
    const scopes = 'user-read-private user-read-email';

    const handleLogin = () => {
        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        console.log('Redirecting to:', authUrl);  // Debugging
        window.location.href = authUrl;
    };

    return (
        <button onClick={handleLogin}>
            Login
        </button>
    );
};

export default SpotifyAuthButton;
