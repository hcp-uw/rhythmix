import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Callback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const hash = new URLSearchParams(location.hash.substring(1));
        const token = hash.get('access_token');
        console.log('Access token:', token);  // Debugging]

        if (token) {
            localStorage.setItem('spotifyAccessToken', token);
            navigate('/'); // Redirect to the desired route after login
        } else {
            navigate('/'); // Redirect to home or an error page if needed
        }
    }, [location, navigate]);

    return <div></div>;
};

export default Callback;
