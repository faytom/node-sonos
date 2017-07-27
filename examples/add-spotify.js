const {Sonos, SpotifyRegion} = require('../');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

const spotifyTrackTd = '5AdoS3gS47x40nBNlNmPQ8'; // Slayer ftw

sonos.addSpotify(spotifyTrackTd, (err, res) => {
  console.log(err);
  console.log(res);
});

//
// or if you use spotify EU service
//
const sonosWithSpotifyEU = new Sonos(process.env.SONOS_HOST || '192.168.2.11');
sonosWithSpotifyEU.setRegion(SpotifyRegion.EU);

sonosWithSpotifyEU.addSpotify(spotifyTrackTd, (err, res) => {
  console.log(err);
  console.log(res);
});
