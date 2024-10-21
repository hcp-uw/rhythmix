const { updatePlaylists } = require('./functions');

exports.handler = async (event, context) => {
  const key = event.path.split('/').pop()
  if (key === process.env.REFRESH_ACCESS_KEY) {
    await updatePlaylists();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Updated playlists"}),
    };
  }
  return {
    statusCode: 500,
    body: JSON.stringify("Incorrect key"),
  };
};
