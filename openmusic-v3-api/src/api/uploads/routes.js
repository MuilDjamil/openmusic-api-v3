const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 512000,
        output: 'stream',
      },
    },
  },
  {
    method: 'GET',
    path: '/cover/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname),
      },
    },
  },
];

module.exports = routes;
