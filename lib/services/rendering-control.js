const Service = require('./service');

class RenderingControl extends Service {
  constructor(host, port) {
    super();
    this.name = 'RenderingControl';
    this.host = host;
    this.port = port || 1400;
    this.controlURL = '/MediaRenderer/RenderingControl/Control';
    this.eventSubURL = '/MediaRenderer/RenderingControl/Event';
    this.SCPDURL = '/xml/RenderingControl1.xml';
  }
  GetVolume(options, callback) {
    this._request('GetVolume', options, callback);
  }
  SetVolume(options, callback) {
    this._request('SetVolume', options, callback);
  }
}

module.exports = RenderingControl;
