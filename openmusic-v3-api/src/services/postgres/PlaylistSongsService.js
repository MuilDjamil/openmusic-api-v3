const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    try {
      const id = `playlist_songs-${nanoid(16)}`;

      const query = {
        text: 'INSERT INTO playlist_songs(id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
        values: [id, playlistId, songId],
      };
      const result = await this._pool.query(query);

      if (result.rows.length === 0) {
        throw new InvariantError('Invariant Error: Failed to add song to playlist');
      }
    } catch {
      throw new InvariantError('Invariant Error: Failed to add song to playlist');
    }
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    try {
      const query = {
        text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
        values: [playlistId, songId],
      };
      const result = await this._pool.query(query);

      if (result.rows.length === 0) {
        throw new InvariantError('Invariant Error: Failed to delete song from playlist');
      }
    } catch {
      throw new InvariantError('Invariant Error: Failed to delete song from playlist');
    }
  }
}

module.exports = PlaylistSongsService;
