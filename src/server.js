// dotenv and Hapi
require('dotenv').config();
const Hapi = require('@hapi/hapi');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgresql/SongService');
const {SongsValidator} = require('./validator/songs');

// users
const users = require('./api/users');
const UserService = require('./services/postgresql/UserService');
const {UsersValidator} = require('./validator/users');

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UserService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
