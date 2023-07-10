const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsLikeService {
  constructor(cacheService) {
    this._pool = new Pool();

    this._cacheService = cacheService;
  }

  async likeAlbum(userId, albumId) {
    try {
      const id = `albumlike-${nanoid(16)}`;

      const query = {
        text: 'INSERT INTO albums_like VALUES ($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      };
      const result = await this._pool.query(query);

      if (result.rows.length === 0) {
        throw new InvariantError('Invariant Error: Failed to like album');
      }

      await this._cacheService.delete(albumId);
    } catch (error) {
      throw new InvariantError('Invariant Error: Failed to like album');
    }
  }

  async dislikeAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM albums_like WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('InvariantError: Failed to dislike album');
    }

    await this._cacheService.delete(albumId);
  }

  async getAlbumLikes(albumId) {
    try {
      const cacheData = await this._cacheService.get(albumId);
      const {likes} = JSON.parse(cacheData);

      return {
        src: 'cache',
        likes,
      };
    } catch {
      const query = {
        text: 'SELECT COUNT(user_id) AS likes FROM albums_like WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);

      await this._cacheService.set(albumId, JSON.stringify(result.rows[0]));

      return result.rows[0];
    }
  }
}

module.exports = AlbumsLikeService;
