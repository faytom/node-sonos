const {Sonos} = require('../index');
const Listener = require('../lib/events/listener');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.96.55');
const x = new Listener(sonos, {interface: 'public'}); // Specify interface name when using multiple interfaces. or public for default.

x.listen(err => {
  if (err) {
    throw err;
  }

  x.addService('/MediaRenderer/AVTransport/Event', (error, sid) => {
    if (error) {
      throw err;
    }
    console.log('Successfully subscribed, with subscription id', sid);
  });

  x.on('serviceEvent', (endpoint, sid, data) => {
    // It's a shame the data isn't in a nice track object, but this might need some more work.
    // At this moment we know something is changed, either the play state or an other song.
    console.log('Received event from', endpoint, '(' + sid + ') with data:', data, '\n\n');
    sonos.currentTrack((err, track) => {
      console.log(err, track);
    });
  });
});
