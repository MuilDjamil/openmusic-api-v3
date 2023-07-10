const autoBind = require('auto-bind');

class UploadsHandler {
  constructor({storageService, albumsService, validator}) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadCoverHandler(request, h) {
    const {cover} = request.payload;
    const {id: albumId} = request.params;

    this._validator.validateUploadCoverHeaders(cover.hapi.headers);

    const coverFilename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/cover/images/${coverFilename}`;
    await this._albumsService.updateCoverUrlById(albumId, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Album cover updated',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
