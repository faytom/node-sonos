const {Sonos} = require('../');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.19', process.env.SONOS_PORT || 1400);

sonos.getCurrentState((err, track) => {
  console.log(err, track);
});
