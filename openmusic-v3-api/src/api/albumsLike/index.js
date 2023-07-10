const routes = require('./routes');
const AlbumsLikeHandler = require('./handler');

module.exports = {
  name: 'albums_like',
  version: '1.0.0',
  register: async (server, {albumsLikeService, albumsService}) => {
    const albumsLikeHandler = new AlbumsLikeHandler(albumsLikeService, albumsService);
    server.route(routes(albumsLikeHandler));
  },
};
