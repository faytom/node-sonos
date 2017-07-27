let text = 'Ben Evens made a nice node JS library for your sonos system';

const {Sonos} = require('../');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

// Replace all spaces with a _ because Sonos doesn't support spaces
text = text.replace(/ /g, '_');

// For supported languages see www.voicerss.org/api/documentation.aspx
// This url just redirects to voicerss because of the specific url format for the sonos
const url = 'http://i872953.iris.fhict.nl/speech/en-us_' + encodeURIComponent(text) + '.mp3';

sonos.queueNext(url, (err, playing) => {
  console.log([err, playing]);
});
