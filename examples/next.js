const {Sonos} = require('../');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

sonos.next((err, nexted) => {
  if (!err || !nexted) {
    console.log('Complete');
  } else {
    console.log('OOOHHHHHH NOOOO');
  }
});
