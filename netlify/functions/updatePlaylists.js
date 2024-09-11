const { updatePlaylists } = require('./functions');

exports.handler = async (event, context) => {
  await updatePlaylists();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Updated playlists"}),
  };
};
