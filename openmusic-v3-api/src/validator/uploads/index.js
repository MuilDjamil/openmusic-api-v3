const InvariantError = require('../../exceptions/InvariantError');
const {uploadCoverHeadersSchema} = require('./schema');

const uploadsValidator = {
  validateUploadCoverHeaders: (headers) => {
    const validationResult = uploadCoverHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = uploadsValidator;
