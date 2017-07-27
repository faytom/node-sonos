const Service = require('./service');

class GroupManagement extends Service {
  constructor(host, port) {
    super();
    this.name = 'GroupManagement';
    this.host = host;
    this.port = port || 1400;
    this.controlURL = '/GroupManagement/Control';
    this.eventSubURL = '/GroupManagement/Event';
    this.SCPDURL = '/xml/GroupManagement1.xml';
  }
  AddMember(options, callback) {
    this._request('AddMember', options, callback);
  }
  RemoveMember(options, callback) {
    this._request('RemoveMember', options, callback);
  }
  ReportTrackBufferingResult(options, callback) {
    this._request('ReportTrackBufferingResult', options, callback);
  }
}

module.exports = GroupManagement;
