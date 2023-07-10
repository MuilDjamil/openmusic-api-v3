const autoBind = require('auto-bind');

class AlbumsLikeHandler {
  constructor(albumsLikeService, albumsService) {
    this._albumsLikeService = albumsLikeService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const {id: albumId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    await this._albumsLikeService.likeAlbum(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Album liked successfully!',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const {id: albumId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    await this._albumsLikeService.dislikeAlbum(credentialId, albumId);

    return {
      status: 'success',
      message: 'Album disliked successfully!',
    };
  }

  async getAlbumLikesHandler(request, h) {
    const {id: albumId} = request.params;

    await this._albumsService.getAlbumById(albumId);
    const data = await this._albumsLikeService.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(data.likes),
      },
    });

    if (data.src === 'cache') {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumsLikeHandler;
