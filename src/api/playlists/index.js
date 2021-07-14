const routes = require('./routes');
const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService,
    playlistSongsService,
    validator}) => {
    const playlistsHandler = new PlaylistsHandler(
        playlistsService,
        playlistSongsService,
        validator);

    server.route(routes(playlistsHandler));
  },
};
