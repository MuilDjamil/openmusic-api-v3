const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor({
    playlistSongsService,
    playlistsService,
    songsService,
    playlistActivityService,
    validator,
  }) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._playlistActivityService = playlistActivityService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    const {songId} = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.getSongById(songId);

    await this._playlistSongsService.addSongToPlaylist(playlistId, songId);
    await this._playlistActivityService.addActivity({playlistId, songId, credentialId}, 'add');

    const response = h.response({
      status: 'success',
      message: 'Song added to playlist successfully',
    });
    response.code(201);
    return response;
  }

  async getSongsByPlaylistIdHandler(request) {
    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._songsService.getSongsByPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    const {songId} = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.getSongById(songId);

    await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);
    await this._playlistActivityService.addActivity({playlistId, songId, credentialId}, 'delete');

    return {
      status: 'success',
      message: 'Song deleted from playlist successfully',
    };
  }
}

module.exports = PlaylistSongsHandler;
