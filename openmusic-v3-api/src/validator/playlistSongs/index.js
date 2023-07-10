const InvariantError = require('../../exceptions/InvariantError');
const {playlistSongPayloadSchema} = require('./schema');

const playlistSongsValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validationResult = playlistSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = playlistSongsValidator;
