const http = require('http');
const {EventEmitter} = require('events');
const request = require('request');
const ip = require('ip');
const xml2js = require('xml2js');
const _ = require('underscore');

class Listener extends EventEmitter {
  constructor(device, options) {
    super();
    this.device = device;
    this.parser = new xml2js.Parser();
    this.services = {};
    this.options = options || {interface: 'public'}; // If you want to use a different interface for listening, specify the name in options.interface
  }

  _startInternalServer(callback) {
    this.port = 0;
    if ('port' in this.options) {
      this.port = this.options.port;
    }

    this.server = http.createServer((req, res) => {
      let buffer = '';
      req.on('data', d => {
        buffer += d;
      });

      req.on('end', () => {
        req.body = buffer;
        this._messageHandler(req, res);
      });
    }).listen(this.port, () => {
      if (this.port === 0) {
        this.port = this.server.address().port;
      }
      callback(null, this.port);

      setInterval(this._renewServices.bind(this), 1 * 1000);
    });
  }

  _messageHandler(req, res) {
    if (req.method.toUpperCase() === 'NOTIFY' && req.url.toLowerCase() === '/notify') {
      if (!this.services[req.headers.sid]) {
        return;
      }

      const thisService = this.services[req.headers.sid];

      const items = thisService.data || {};
      this.parser.parseString(req.body.toString(), (error, data) => {
        if (error) {
          res.end(500);
        }
        _.each(data['e:propertyset']['e:property'], element => {
          _.each(_.keys(element), key => {
            items[key] = element[key][0];
          });
        });

        this.emit('serviceEvent', thisService.endpoint, req.headers.sid, thisService.data);
        res.end();
      });
    }
  }

  _renewServices() {
    let sid;
    const now = new Date().getTime();

    const renew = function (sid) {
      return function (err, response) {
        const serviceEndpoint = this.services[sid].endpoint;

        if (err || ((response.statusCode !== 200) && (response.statusCode !== 412))) {
          this.emit('error', err || response.statusMessage, serviceEndpoint, sid);
        } else if (response.statusCode === 412) { // Restarted, this is why renewal is at most 300sec
          delete this.services[sid];
          this.addService(serviceEndpoint, function (err, sid) {
            if (err) {
              this.emit('error', err, serviceEndpoint, sid);
            }
          });
        } else {
          this.services[sid].renew = this.renew_at(response.headers.timeout);
        }
      };
    };

    for (sid in this.services) {
      const thisService = this.services[sid];

      if (now < thisService.renew) {
        continue;
      }

      const opt = {
        url: 'http://' + this.device.host + ':' + this.device.port + thisService.endpoint,
        method: 'SUBSCRIBE',
        headers: {
          SID: sid,
          Timeout: 'Second-3600'
        }
      };

      request(opt, renew(sid).bind(this));
    }
  }

  addService(serviceEndpoint, callback) {
    if (!this.server) {
      throw new Error('Service endpoints can only be added after listen() is called');
    } else {
      const opt = {
        url: 'http://' + this.device.host + ':' + this.device.port + serviceEndpoint,
        method: 'SUBSCRIBE',
        headers: {
          callback: '<http://' + ip.address(this.options.interface) + ':' + this.port + '/notify>',
          NT: 'upnp:event',
          Timeout: 'Second-3600'
        }
      };

      request(opt, (err, response) => {
        if (err || response.statusCode !== 200) {
          if (!callback) {
            return console.log(err || response.message || response.statusCode);
          }
          callback(err || response.statusMessage);
        } else {
          callback(null, response.headers.sid);

          this.services[response.headers.sid] = {
            renew: this.renew_at(response.headers.timeout),
            endpoint: serviceEndpoint,
            data: {}
          };
        }
      });
    }
  }

  renew_at(timeout) {
    let seconds;

    if (Boolean(timeout) && (timeout.indexOf('Second-') === 0)) {
      timeout = timeout.substr(7);
    }
    seconds = (((Boolean(timeout)) && (!isNaN(timeout))) ? parseInt(timeout, 10) : 3600) - 15;
    if (seconds < 0) {
      seconds = 15;
    } else if (seconds > 300) {
      seconds = 300;
    }

    return (new Date().getTime() + (seconds * 1000));
  }

  listen(callback) {
    if (this.server) {
      throw new Error('Service listener is already listening');
    } else {
      this._startInternalServer(callback);
    }
  }

  removeService(sid, callback) {
    if (!this.server) {
      throw new Error('Service endpoints can only be modified after listen() is called');
    } else if (!this.services[sid]) {
      throw new Error('Service with sid ' + sid + ' is not registered');
    } else {
      const opt = {
        url: 'http://' + this.device.host + ':' + this.device.port + this.services[sid].endpoint,
        method: 'UNSUBSCRIBE',
        headers: {
          sid
        }
      };

      request(opt, (err, response) => {
        if (err || response.statusCode !== 200) {
          callback(err || response.statusCode);
        } else {
          callback(null, true);
        }
      });
    }
  }
}

module.exports = Listener;
