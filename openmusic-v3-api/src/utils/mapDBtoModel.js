/* eslint-disable camelcase */

const mapAlbumDetailToModel = ({
  id,
  name,
  year,
  cover_url,
}) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
});

module.exports = {mapAlbumDetailToModel};
