const {Pool} = require('pg');
const {nanoid} = require('nanoid');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({playlistId, songId, credentialId}, action) {
    const id = `activity-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5)',
      values: [id, playlistId, songId, credentialId, action],
    };

    await this._pool.query(query);
  }

  async getActivitiesById(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time
        FROM playlist_song_activities AS psa
        LEFT JOIN users AS u ON u.id = psa.user_id
        LEFT JOIN songs AS s ON s.id = psa.song_id
        WHERE psa.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
