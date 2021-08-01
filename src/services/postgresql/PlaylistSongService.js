const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToModel} = require('../../utils');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `ps-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id`,
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist.');
    }

    await this._cacheService.delete(`playlistSongs:${playlistId}`);
  }

  async getSongsInPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistSongs:${playlistId}`);

      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM songs
        INNER JOIN playlistsongs ON songs.id = playlistsongs.song_id
        WHERE playlistsongs.playlist_id = $1
        GROUP BY songs.id`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);
      const mappedResult = result.rows.map(mapDBToModel);

      await this._cacheService.set(`playlistSongs:${playlistId}`, JSON.stringify(mappedResult));

      return mappedResult;
    }
  }

  async verifyPlaylistSong(songId) {
    const query = {
      text: 'SELECT song_id FROM playlistsongs WHERE song_id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Id lagu tidak valid');
    }
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    await this.verifyPlaylistSong(songId);

    const query = {
      text: `DELETE FROM playlistsongs 
      WHERE playlist_id = $1 AND song_id = $2
      RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
          'Lagu gagal dihapus. Id playlist tidak ditemukan');
    }

    await this._cacheService.delete(`playlistSongs:${playlistId}`);
  }
}

module.exports = PlaylistSongsService;
