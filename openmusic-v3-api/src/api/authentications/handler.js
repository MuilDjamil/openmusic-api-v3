const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor({
    authenticationsService,
    usersService,
    tokenManager,
    validator,
  }) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostPayload(request.payload);

    const {username, password} = request.payload;
    const userId = await this._usersService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({userId});
    const refreshToken = this._tokenManager.generateRefreshToken({userId});

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    this._validator.validatePutPayload(request.payload);

    const {refreshToken} = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const {userId} = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({userId});

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeletePayload(request.payload);

    const {refreshToken} = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token deleted successfully',
    };
  }
}

module.exports = AuthenticationsHandler;
