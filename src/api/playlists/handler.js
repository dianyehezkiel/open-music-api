/* eslint-disable max-len */
const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(
      playlistsService,
      playlistSongsService,
      validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsInPlaylistHandler = this.getSongsInPlaylistHandler.bind(this);
    // eslint-disable-next-line max-len
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);

      const {name} = request.payload;
      const {id: credentialId} = request.auth.credentials;

      const playlistId = await this._playlistsService.addPlaylist({
        name,
        userId: credentialId});

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  };

  async getPlaylistsHandler(request, h) {
    try {
      const {id: credentialId} = request.auth.credentials;

      const playlists = await this._playlistsService.getPlaylists(credentialId);

      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  };

  async deletePlaylistByIdHandler(request, h) {
    try {
      const {playlistId} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      await this._playlistsService.deletePlaylistById(playlistId);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  };

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);

      const {songId} = request.payload;
      const {playlistId} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      await this._playlistSongsService.addSongToPlaylist(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  };

  async getSongsInPlaylistHandler(request, h) {
    try {
      const {playlistId} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      const songs = await this._playlistSongsService
          .getSongsInPlaylist(playlistId);

      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      response.code(200);

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  };

  async deleteSongFromPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);

      const {playlistId} = request.params;
      const {songId} = request.payload;
      const {id: credentialId} = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      // eslint-disable-next-line max-len
      await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  };
}

module.exports = PlaylistsHandler;
