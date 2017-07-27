/**
 * Dependencies
 */

const request = require('request');
const {parseString} = require('xml2js');
const _ = require('underscore');

  /**
   * Helpers
   */

const withinEnvelope = function (body) {
  return ['<?xml version="1.0" encoding="utf-8"?>',
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    '  <s:Body>' + body + '</s:Body>',
    '</s:Envelope>'].join('');
};

/**
 * "Class" Service
 */
class Service {
  constructor(options) {
    this.name = options.name;
    this.host = options.host;
    this.port = options.port || 1400;
    this.controlURL = options.controlURL;
    this.eventSubURL = options.eventSubURL;
    this.SCPDURL = options.SCPDURL;
  }

  _request(action, variables, callback) {
    const messageAction = '"urn:schemas-upnp-org:service:' + this.name + ':1#' + action + '"';
    const messageBodyPre = '<u:' + action + ' xmlns:u="urn:schemas-upnp-org:service:' + this.name + ':1">';
    const messageBodyPost = '</u:' + action + '>';
    const messageBody = messageBodyPre + _.map(variables, (value, key) => {
      return '<' + key + '>' + value + '</' + key + '>';
    }).join('') + messageBodyPost;
    const responseTag = 'u:' + action + 'Response';

    request({
      uri: 'http://' + this.host + ':' + this.port + this.controlURL,
      method: 'POST',
      headers: {
        SOAPAction: messageAction,
        'Content-type': 'text/xml; charset=utf8'
      },
      body: withinEnvelope(messageBody)
    }, (err, res, body) => {
      if (err) {
        return callback(err);
      }

      parseString(body, (err, json) => {
        if (err) {
          return callback(err);
        }

        if (typeof json['s:Envelope']['s:Body'][0]['s:Fault'] !== 'undefined') {
          return callback(new Error(json['s:Envelope']['s:Body'][0]['s:Fault'][0].faultstring[0] +
            ': ' + json['s:Envelope']['s:Body'][0]['s:Fault'][0].detail[0].UPnPError[0].errorCode[0]));
        }

        const output = json['s:Envelope']['s:Body'][0][responseTag][0];
        delete output.$;
        _.each(output, (item, key) => {
          output[key] = item[0];
        });
        return callback(null, output);
      });
    });
  }
}

module.exports = Service;
