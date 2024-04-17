export const UpdatePlaylists = () => {
    // Check when a playlist was last updated
    // If made 1 day ago (yesterday), loop through every playlist, remove every song
    // Find 25 songs for each playlist, algo needed:
    console.log(Date());
}

export const GenreToPlaylistMap = new Map<string, string>([
    ["Pop", "https://open.spotify.com/embed/playlist/37i9dQZF1EQncLwOalG3K7?utm_source=generator"],
    ["Hip-Hop", "https://open.spotify.com/embed/playlist/37i9dQZF1EQnqst5TRi17F?utm_source=generator"],
    ["Indie", "https://open.spotify.com/embed/playlist/37i9dQZF1EQqkOPvHGajmW?utm_source=generator"],
    ["R&B", "https://open.spotify.com/embed/playlist/37i9dQZF1EQoqCH7BwIYb7?utm_source=generator"],
    // TODO: add other genres
]);