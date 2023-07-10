const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(playlistActivityService, playlistsService) {
    this._playlistActivityService = playlistActivityService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getActivityHandler(request) {
    const {id: playlistId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const activities = await this._playlistActivityService.getActivitiesById(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistActivitiesHandler;
