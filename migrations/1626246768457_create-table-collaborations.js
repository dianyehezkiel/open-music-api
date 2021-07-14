/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
      'collaborations',
      'UQ_Collaborations_PlaylistId_UserId',
      'UNIQUE(playlist_id, user_id)');

  pgm.addConstraint(
      'collaborations',
      'FK_Collaborations_Playlists',
      'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
      'collaborations',
      'FK_Collaborations_Users',
      'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'UQ_Collaborations_PlaylistId_UserId');
  pgm.dropConstraint('collaborations', 'FK_Collaborations_Playlists');
  pgm.dropConstraint('collaborations', 'FK_Collaborations_Users');

  pgm.dropTable('collaborations');
};
