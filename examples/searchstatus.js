const debug = require('debug')('search');
const sonos = require('../');

sonos.search(sonos => {
  debug('Found Sonos \'%s\'', sonos.host);
  sonos.currentTrack((err, track) => {
    if (err) {
      throw err;
    }
    console.log(track || 'Nothing Playing');
  });
});
