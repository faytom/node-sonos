const sonos = require('../index');

console.log('\nSearching for Sonos devices on network...');

sonos.search((device, model) => {
  let devInfo = '\n';
  devInfo += 'Device \t' + JSON.stringify(device) + ' (' + model + ')\n';
  device.getZoneAttrs((err, attrs) => {
    if (err) {
      devInfo += '`- failed to retrieve zone attributes\n';
    }
    devInfo += '`- attrs: \t' + JSON.stringify(attrs).replace(/",/g, '",\n\t\t') + '\n';

    device.getZoneInfo((err, info) => {
      if (err) {
        devInfo += '`- failed to retrieve zone information\n';
      }

      devInfo += '`- info: \t' + JSON.stringify(info).replace(/",/g, '",\n\t\t') + '\n';

      device.getTopology((err, info) => {
        if (err) {
          throw err;
        }
        devInfo += '`- topology: \t' + JSON.stringify(info.zones).replace(/",/g, '",\n\t\t') + '\n';
        console.log(devInfo);
      });
    });
  });
});
