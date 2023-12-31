const InvariantError = require('../../exceptions/InvariantError');
const {playlistPayloadSchema} = require('./schema');

const playlistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = playlistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = playlistsValidator;
