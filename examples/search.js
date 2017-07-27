const Sonos = require('../');

console.log('Searching for Sonos devices...');
const search = Sonos.search();

search.on('DeviceAvailable', (device, model) => {
  console.log(device, model);
});

// Optionally stop searching and destroy after some time
setTimeout(() => {
  console.log('Stop searching for Sonos devices');
  search.destroy();
}, 30000);
