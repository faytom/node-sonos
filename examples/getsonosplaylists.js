const {Sonos} = require('../').Sonos;

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

sonos.getMusicLibrary('sonos_playlists', {start: 0, total: 25}, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
