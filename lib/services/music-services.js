const Service = require('./service');

class MusicServices extends Service {
  constructor(host, port) {
    super();
    this.name = 'MusicServices';
    this.host = host;
    this.port = port || 1400;
    this.controlURL = '/MusicServices/Control';
    this.eventSubURL = '/MusicServices/Event';
    this.SCPDURL = '/xml/MusicServices1.xml';
  }
  GetSessionId(options, callback) {
    this._request('GetSessionId', options, callback);
  }
  ListAvailableServices(options, callback) {
    this._request('ListAvailableServices', options, callback);
  }
  UpdateAvailableServices(options, callback) {
    this._request('UpdateAvailableServices', options, callback);
  }
}

module.exports = MusicServices;
