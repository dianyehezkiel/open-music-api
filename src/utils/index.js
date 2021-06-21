/* eslint-disable camelcase */
const mapDBToModel = ({
  song_id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id: song_id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = {mapDBToModel};
