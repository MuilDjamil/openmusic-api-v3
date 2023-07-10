exports.up = (pgm) => {
  pgm.createTable('albums_like', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'albums',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('albums_like', 'unique_user_id_and_album_id', 'UNIQUE (user_id, album_id)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('albums_like', 'unique_user_id_and_album_id');

  pgm.dropTable('albums_like');
};
