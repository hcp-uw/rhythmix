// Delete playlists created through custom playlist and song match
// export const deletePlaylistsClick = () => {
//   fetch('https://api.spotify.com/v1/me/playlists?limit=25&offset=0', {
//     method: 'GET',
//     headers: {
//       'Authorization': 'Bearer ' + access_token
//     }
//   }).then((res) => generalResp(res, "deletePlaylists"))
//     .catch(() => generalError("deletePlaylists fetch failed"));
// };

// const deletePlaylistsJson = (data: unknown): void => {
//   for (const item of data.items) {
//     if (item.name === "Your New Custom Playlist") {
//       deletePlaylistHelper(item.id);
//     }
//   }
// };

// const deletePlaylistHelper = (id: string): void => {
//   const fetch_url = "https://api.spotify.com/v1/playlists/" + id + "/followers";
//   fetch(fetch_url, {
//     method: 'DELETE',
//     headers: {
//       'Authorization': 'Bearer ' + access_token
//     }
//   }).then(deletePlaylistHelperResp)
//     .catch(() => generalError("deletePlaylistHelper fetch failed"));
// };

// const deletePlaylistHelperResp = (res: Response): void => {
//   if (res.status !== 200) {
//     generalError('Bad status code: ' + res.status);
//   }
// };
