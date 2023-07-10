const routes = require('./routes');
const PlaylistSongsHandler = require('./handler');

module.exports = {
  name: 'playlist_songs',
  version: '1.0.0',
  register: async (server, {
    playlistSongsService,
    playlistsService,
    songsService,
    playlistActivityService,
    validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler({
      playlistSongsService,
      playlistsService,
      songsService,
      playlistActivityService,
      validator,
    });
    server.route(routes(playlistSongsHandler));
  },
};
