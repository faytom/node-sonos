const _ = require('underscore');
const sonos = require('../index');

const TIMEOUT = 2000; // Search for 2 seconds, increase this value if not all devices are shown
const devices = [];

  // Functions to process device information

function getBridges(deviceList) {
  const bridges = [];
  deviceList.forEach(device => {
    if (device.CurrentZoneName === 'BRIDGE' && bridges.indexOf(device.ip + ':' + device.port) === -1) {
      bridges.push(device.ip + ':' + device.port);
    }
  });
  return bridges;
}

function getBridgeDevices(deviceList) {
  const bridgeDevices = [];
  deviceList.forEach(device => {
    if (device.CurrentZoneName === 'BRIDGE') {
      bridgeDevices.push(device);
    }
  });
  return bridgeDevices;
}

function getZones(deviceList) {
  const zones = [];
  deviceList.forEach(device => {
    if (zones.indexOf(device.CurrentZoneName) === -1 && device.CurrentZoneName !== 'BRIDGE') {
      zones.push(device.CurrentZoneName);
    }
  });
  return zones;
}

function getZoneDevices(zone, deviceList) {
  const zoneDevices = [];
  deviceList.forEach(device => {
    if (device.CurrentZoneName === zone) {
      zoneDevices.push(device);
    }
  });
  return zoneDevices;
}

function getZoneCoordinator(zone, deviceList) {
  let coordinator;
  deviceList.forEach(device => {
    if (device.CurrentZoneName === zone && device.coordinator === 'true') {
      coordinator = device;
    }
  });
  return coordinator;
}

// Search and collect device information

sonos.search({timeout: TIMEOUT}, (device, model) => {
  const data = {ip: device.host, port: device.port, model};

  device.getZoneAttrs((err, attrs) => {
    if (!err) {
      _.extend(data, attrs);
    }
    device.getZoneInfo((err, info) => {
      if (!err) {
        _.extend(data, info);
      }
      device.getTopology((err, info) => {
        if (!err) {
          info.zones.forEach(group => {
            if (group.location === 'http://' + data.ip + ':' + data.port + '/xml/device_description.xml') {
              _.extend(data, group);
            }
          });
        }
        devices.push(data);
      });
    });
  });
});

// Display device information in structured form

setTimeout(() => {
  console.log('\nBridges:\n--------');
  getBridges(devices).forEach(bridge => {
    console.log(bridge);
    getBridgeDevices(devices).forEach(device => {
      console.log('\t' + JSON.stringify(device));
    });
  });
  console.log('\nZones (coordinator):\n--------------------');
  getZones(devices).forEach(zone => {
    const coordinator = getZoneCoordinator(zone, devices);
    if (coordinator !== undefined) {
      console.log(zone + ' (' + coordinator.ip + ':' + coordinator.port + ')');
    }
    getZoneDevices(zone, devices).forEach(device => {
      console.log('\t' + JSON.stringify(device));
    });
  });
}, TIMEOUT);
