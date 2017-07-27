const Service = require('./service');

class GroupRenderingControl extends Service {
  constructor(host, port) {
    super();
    this.name = 'GroupRenderingControl';
    this.host = host;
    this.port = port || 1400;
    this.controlURL = '/MediaRenderer/GroupRenderingControl/Control';
    this.eventSubURL = '/MediaRenderer/GroupRenderingControl/Event';
    this.SCPDURL = '/xml/GroupRenderingControl1.xml';
  }
}

module.exports = GroupRenderingControl;
