const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const {id: playlistId} = request.params;
    const {targetEmail} = request.payload;
    const {id: credentialId} = request.auth.credentials;

    const message = {
      playlistId,
      targetEmail,
    };

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._producerService.sendMessage(`export:playlist`, JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Export request send to queue',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
