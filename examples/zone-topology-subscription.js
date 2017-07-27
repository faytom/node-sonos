const {Sonos} = require('../index');
const Listener = require('../lib/events/listener');

const x = new Listener(new Sonos(process.env.SONOS_HOST || '192.168.2.11'));
x.listen(err => {
  if (err) {
    throw err;
  }

  x.addService('/ZoneGroupTopology/Event', (error, sid) => {
    if (error) {
      throw err;
    }
    console.log('Successfully subscribed, with subscription id', sid);
  });

  x.on('serviceEvent', (endpoint, sid, data) => {
    console.log('Received event from', endpoint, '(' + sid + ') with data:', data, '\n\n');
  });
});
