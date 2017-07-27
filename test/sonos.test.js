/* eslint-env mocha */
const assert = require('assert');
const SONOS = require('../');

const Sonos = SONOS.Sonos;

describe('Sonos', () => {
  describe('play()', () => {
    it('should generate play command', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#Play"');
        assert(body === '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>');
        done();
      };

      sonos.play();
    });

    it('should accept a uri string', done => {
      const sonos = new Sonos('localhost', 1400);

      let actionCounter = 0;

      sonos.request = function (endpoint, action, body, _, callback) {
        actionCounter++;

        if (actionCounter === 1) {
          assert(endpoint === '/MediaRenderer/AVTransport/Control');
          assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
          assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</EnqueuedURI><EnqueuedURIMetaData></EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
          callback(null, [{
            FirstTrackNumberEnqueued: ['1'],
            NewQueueLength: ['1'],
            NumTracksAdded: ['1']
          }]);
        } else if (actionCounter === 2) {
          assert(endpoint === '/MediaRenderer/AVTransport/Control');
          assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#Seek"');
          assert(body === '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>TRACK_NR</Unit><Target>1</Target></u:Seek>');
          callback(null, [{
            $: {'xmlns:u': 'urn:schemas-upnp-org:service:AVTransport:1'}
          }]);
        } else if (actionCounter === 3) {
          assert(endpoint === '/MediaRenderer/AVTransport/Control');
          assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#Play"');
          assert(body === '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>');
          done();
        }
      };

      sonos.play('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3');
    });

    it('should be able to accept an object instead of uri', done => {
      const sonos = new Sonos('localhost', 1400);

      let actionCounter = 0;

      sonos.request = function (endpoint, action, body, _, callback) {
        actionCounter++;

        if (actionCounter === 1) {
          assert(endpoint === '/MediaRenderer/AVTransport/Control');
          assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
          assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</EnqueuedURI><EnqueuedURIMetaData>test</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
          callback(null, [{
            FirstTrackNumberEnqueued: ['1'],
            NewQueueLength: ['1'],
            NumTracksAdded: ['1']
          }]);
        } else if (actionCounter === 2) {
          assert(endpoint === '/MediaRenderer/AVTransport/Control');
          assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#Seek"');
          assert(body === '<u:Seek xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Unit>TRACK_NR</Unit><Target>1</Target></u:Seek>');
          callback(null, [{
            $: {'xmlns:u': 'urn:schemas-upnp-org:service:AVTransport:1'}
          }]);
        } else if (actionCounter === 3) {
          assert(endpoint === '/MediaRenderer/AVTransport/Control');
          assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#Play"');
          assert(body === '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>');
          done();
        }
      };

      sonos.play({
        uri: 'http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3',
        metadata: 'test'
      });
    });
  });

  describe('queue()', () => {
    it('should generate queue command', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
        assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</EnqueuedURI><EnqueuedURIMetaData></EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
        done();
      };

      sonos.queue('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3', () => {});
    });

    it('should accept object in place of uri', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
        assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</EnqueuedURI><EnqueuedURIMetaData>&lt;test&gt;&quot;hello&quot;&lt;/test&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
        done();
      };

      sonos.queue({
        uri: 'http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3',
        metadata: '<test>"hello"</test>'
      }, () => {});
    });

    it('should accept a Spotify track uri', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
        assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>spotify%3atrack%3a1AhDOtG9vPSOmsWgNW0BEY</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;00032020spotify%3atrack%3a1AhDOtG9vPSOmsWgNW0BEY&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
        done();
      };

      sonos.queue('spotify:track:1AhDOtG9vPSOmsWgNW0BEY', () => {});
    });

    it('should accept a Spotify EU track uri', done => {
      const sonos = new Sonos('localhost', 1400);
      sonos.setSpotifyRegion(SONOS.SpotifyRegion.EU);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
        assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>spotify%3atrack%3a1AhDOtG9vPSOmsWgNW0BEY</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;00032020spotify%3atrack%3a1AhDOtG9vPSOmsWgNW0BEY&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
        done();
      };

      sonos.queue('spotify:track:1AhDOtG9vPSOmsWgNW0BEY', () => {});
    });

    it('should accept a Spotify album uri', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
        assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-rincon-cpcontainer:0004206cspotify%3aalbum%3a1TSZDcvlPtAnekTaItI3qO</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;0004206cspotify%3aalbum%3a1TSZDcvlPtAnekTaItI3qO&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.album.musicAlbum&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
        done();
      };

      sonos.queue('spotify:album:1TSZDcvlPtAnekTaItI3qO', () => {});
    });

    it('should accept a Spotify artist top tracks uri', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
        assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-rincon-cpcontainer:000e206cspotify%3aartistTopTracks%3a1dfeR4HaWDbWqFHLkxsg1d</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;000e206cspotify%3aartistTopTracks%3a1dfeR4HaWDbWqFHLkxsg1d&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.playlistContainer&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
        done();
      };

      sonos.queue('spotify:artistTopTracks:1dfeR4HaWDbWqFHLkxsg1d', () => {});
    });

    it('should accept a Spotify user public playlist uri', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
        assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-rincon-cpcontainer:0006206cspotify%3auser%3a26iFraqozskd5POrzg68pr</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;0006206cspotify%3auser%3a26iFraqozskd5POrzg68pr&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.playlistContainer&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
        done();
      };

      sonos.queue('spotify:user:26iFraqozskd5POrzg68pr', () => {});
    });

    it('should accept a Spotify EU user public playlist uri', done => {
      const sonos = new Sonos('localhost', 1400);
      sonos.setSpotifyRegion(SONOS.SpotifyRegion.EU);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
        assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>x-rincon-cpcontainer:0006206cspotify%3auser%3a26iFraqozskd5POrzg68pr</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;0006206cspotify%3auser%3a26iFraqozskd5POrzg68pr&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;&lt;/dc:title&gt;&lt;upnp:class&gt;object.container.playlistContainer&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON2311_X_#Svc2311-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
        done();
      };

      sonos.queue('spotify:user:26iFraqozskd5POrzg68pr', () => {});
    });

    it('should accept a Spotify artist radio uri', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"');
        assert(body === '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>spotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d</EnqueuedURI><EnqueuedURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;000c206cspotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Artist Radio&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>');
        done();
      };

      sonos.queue('spotify:artistRadio:1dfeR4HaWDbWqFHLkxsg1d', () => {});
    });
  });

  describe('playTuneinRadio()', () => {
    it('should generate play command', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"');
        assert(body === '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-stream:s34682?sid=254&amp;flags=8224&amp;sn=0</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;F00092020s34682&quot; parentID=&quot;L&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;88.5 | Jazz24 (Jazz)&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON65031_&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>');
        done();
      };

      sonos.playTuneinRadio('34682', '88.5 | Jazz24 (Jazz)', () => {});
    });
  });

  describe('playSpotifyRadio()', () => {
    it('should generate play command', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"');
        assert(body === '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>x-sonosapi-radio:spotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d?sid=12&amp;flags=8300&amp;sn=1</CurrentURI><CurrentURIMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;000c206cspotify%3aartistRadio%3a1dfeR4HaWDbWqFHLkxsg1d&quot; restricted=&quot;true&quot;&gt;&lt;dc:title&gt;Queen&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.audioBroadcast.#artistRadio&lt;/upnp:class&gt;&lt;desc id=&quot;cdudn&quot; nameSpace=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot;&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</CurrentURIMetaData></u:SetAVTransportURI>');
        done();
      };

      sonos.playSpotifyRadio('1dfeR4HaWDbWqFHLkxsg1d', 'Queen', () => {});
    });
  });

  describe('queueNext()', () => {
    it('should generate queue command', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"');
        assert(body === '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</CurrentURI><CurrentURIMetaData></CurrentURIMetaData></u:SetAVTransportURI>');
        done();
      };

      sonos.queueNext('http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3', () => {});
    });

    it('should accept object in place of uri', done => {
      const sonos = new Sonos('localhost', 1400);

      sonos.request = function (endpoint, action, body) {
        assert(endpoint === '/MediaRenderer/AVTransport/Control');
        assert(action === '"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"');
        assert(body === '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><CurrentURI>http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3</CurrentURI><CurrentURIMetaData>&lt;test&gt;&quot;hello&quot;&lt;/test&gt;</CurrentURIMetaData></u:SetAVTransportURI>');
        done();
      };

      sonos.queueNext({
        uri: 'http://livingears.com/music/SceneNotHeard/091909/Do You Mind Kyla.mp3',
        metadata: '<test>"hello"</test>'
      }, () => {});
    });
  });
});

describe('search', () => {
  it('should emit a timeout event when timeout is hit', done => {
    setTimeout(() => {
      assert(false, 'Event never fired');
      done();
    }, 100);

    const search = SONOS.search({timeout: 10}, () => {});

    search.on('timeout', () => {
      assert(true);
      done();
    });
  });

  it('should not emit a timeout event when no timeout option is passed in', done => {
    setTimeout(() => {
      assert(true);
      done();
    }, 10);

    const search = SONOS.search(() => {});

    search.on('timeout', () => {
      assert(false, 'Timeout event should never fire');
      done();
    });
  });

  it('should not emit a timeout event after search is stopped', done => {
    const search = SONOS.search({timeout: 10}, () => {});

    search.on('timeout', () => {
      assert(false, 'Timeout event should never fire');
      done();
    });
    search.destroy(() => {
      assert(true);
      done();
    });
  });
});
