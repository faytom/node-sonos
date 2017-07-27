const Service = require('./service');

class ZoneGroupTopology extends Service {
  constructor(host, port) {
    super();
    this.name = 'ZoneGroupTopology';
    this.host = host;
    this.port = port || 1400;
    this.controlURL = '/ZoneGroupTopology/Control';
    this.eventSubURL = '/ZoneGroupTopology/Event';
    this.SCPDURL = '/xml/ZoneGroupTopology1.xml';
  }
  CheckForUpdate(options, callback) {
    this._request('CheckForUpdate', options, callback);
  }
  BeginSoftwareUpdate(options, callback) {
    this._request('BeginSoftwareUpdate', options, callback);
  }
  ReportUnresponsiveDevice(options, callback) {
    this._request('ReportUnresponsiveDevice', options, callback);
  }
  ReportAlarmStartedRunning(options, callback) {
    this._request('ReportAlarmStartedRunning', options, callback);
  }
  SubmitDiagnostics(options, callback) {
    this._request('SubmitDiagnostics', options, callback);
  }
  RegisterMobileDevice(options, callback) {
    this._request('RegisterMobileDevice', options, callback);
  }
  GetZoneGroupAttributes(options, callback) {
    this._request('GetZoneGroupAttributes', options, callback);
  }
}

module.exports = ZoneGroupTopology;
