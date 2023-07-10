const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({title, year, performer, genre, duration, albumId}) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };
    const result = await this._pool.query(query);

    if (result.rows[0].id === undefined) {
      throw new InvariantError('Invariant Error: Failed to add song');
    }

    return result.rows[0].id;
  }

  async getSongs({title, performer}) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('NotFound Error: Can\'t find song');
    }

    return result.rows[0];
  }

  async updateSongById(id, {title, year, performer, genre, duration, albumId}) {
    const query = {
      text: `UPDATE songs 
        SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 
        WHERE id = $7 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, id],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('NotFound Error: Failed to update song');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('NotFound Error: Failed to delete song');
    }
  }

  async getSongsByAlbumId(id) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async getSongsByPlaylistId(id) {
    const query = {
      text: `SELECT s.id, s.title, s.performer FROM songs AS s
        JOIN playlist_songs AS ps ON ps.song_id = s.id
        WHERE ps.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = SongsService;
