const Joi = require('joi');

const playlistSongPayloadSchema = Joi.object({
  songId: Joi.string().max(50).required(),
});

module.exports = {playlistSongPayloadSchema};
