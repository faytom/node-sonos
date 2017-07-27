const {Sonos} = require('../');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

sonos.getMusicLibrary('playlists', {start: 0, total: 25}, (err, result) => {
  console.log([err, result]);
});
