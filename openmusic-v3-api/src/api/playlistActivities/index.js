const routes = require('./routes');
const PlaylistActivitiesHandler = require('./handler');

module.exports = {
  name: 'playlist_activities',
  version: '1.0.0',
  register: async (server, {playlistActivityService, playlistsService}) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(playlistActivityService, playlistsService);
    server.route(routes(playlistActivitiesHandler));
  },
};
