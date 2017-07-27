const http = require('http');
const {Sonos} = require('../');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.2.11');

const server = http.createServer((req, res) => {
  sonos.currentTrack((err, track) => {
    if (err) {
      throw err;
    }

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    const rows = [];

    for (const key in track) {
      if (key === 'albumArtURI') {
        rows.push('<tr><th>' + key + '</th><td>' + track[key] + '</td></tr>');
      }
    }

    res.write('<table>' + rows.join('') + '</table>');
    res.end();
  });
});

server.listen(process.env.PORT || 3000);
