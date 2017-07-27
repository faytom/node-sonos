const {Sonos} = require('../');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

sonos.play((err, playing) => {
  console.log([err, playing]);
});
