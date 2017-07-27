/* eslint-env mocha */
const assert = require('assert');
const sonos = require('../');

describe('On site Sonos', () => {
  let device = null;
  before(done => {
    sonos.search(dev => {
      device = dev;
      done();
    });
  });

  describe('Search Music Library', () => {
    it('returns search results from the Sonos library', done => {
      // TODO: Verify data response
      device.searchMusicLibrary('tracks', 'Newton', {}, done);
    });
  });

  describe('Favorites Radio', () => {
    let device = null;

    before(done => {
      sonos.search(dev => {
        device = dev;
        done();
      });
    });

    it('should return favorite radio stations', done => {
      device.getFavoritesRadioStations({}, (err, result) => {
        assert(err !== false);
        assert(result);
        done();
      });
    });

    it('should return favorite radio shows', done => {
      device.getFavoritesRadioShows({}, (err, result) => {
        assert(err !== false);
        assert(result);
        done();
      });
    });
  });

  it('should return Sonos playlists', done => {
    device.searchMusicLibrary('sonos_playlists', null, {}, (err, result) => {
      assert(err !== false);
      assert(result);
      done();
    });
  });
});
