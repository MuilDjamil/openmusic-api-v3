const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    try {
      const id = `collab-${nanoid(16)}`;

      const query = {
        text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
        values: [id, playlistId, userId],
      };
      const result = await this._pool.query(query);

      if (result.rows[0].id === undefined) {
        throw new InvariantError('Invariant Error: Failed to add Collaboration');
      }

      return result.rows[0].id;
    } catch {
      throw new InvariantError('Invariant Error: Failed to add Collaboration');
    }
  }

  async deleteCollaboration(playlistId, userId) {
    try {
      const query = {
        text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
        values: [playlistId, userId],
      };
      const result = await this._pool.query(query);

      if (result.rows.length === 0) {
        throw new InvariantError('Invariant Error: Failed to delete collaboration');
      }
    } catch {
      throw new InvariantError('Invariant Error: Failed to delete collaboration');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('Collaboration doesn\'t exist');
    }
  }
}

module.exports = CollaborationsService;
