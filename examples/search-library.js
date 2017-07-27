const {Sonos} = require('../');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.1.19', process.env.SONOS_PORT || 1400);

sonos.searchMusicLibrary('tracks', 'orange crush', (err, data) => {
  console.log(err, data);
});
