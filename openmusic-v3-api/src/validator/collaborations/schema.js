const Joi = require('joi');

const collaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().max(50).required(),
  userId: Joi.string().max(50).required(),
});

module.exports = {collaborationPayloadSchema};
