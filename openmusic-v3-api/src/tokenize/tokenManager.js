const JWT = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const tokenManager = {
  generateAccessToken: (payload) => JWT.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => JWT.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = JWT.token.decode(refreshToken);

      JWT.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      const {payload} = artifacts.decoded;
      return payload;
    } catch {
      throw new InvariantError('Invariant Error: Invalid refresh token');
    }
  },
};

module.exports = tokenManager;
