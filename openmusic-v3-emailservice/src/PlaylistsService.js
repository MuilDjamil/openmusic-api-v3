const {Pool} = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('NotFound Error: Can\'t find playlist');
    }

    const songs = await this.getPlaylistSongsById(id);

    return {
      playlist: {
        ...result.rows[0],
        songs,
      }
    }
  }

  async getPlaylistSongsById(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer FROM songs AS s
        JOIN playlist_songs AS ps ON ps.song_id = s.id
        WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistsService;
