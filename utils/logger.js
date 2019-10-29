const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const fs = require('fs');

const formatOut = bformat({
  outputMode: 'long',
});

const log = bunyan.createLogger({
  name: 'app',
  streams: [{
    level: 'trace',
    type: 'file',
    path: 'error.log',

  },
  {
    level: 'trace',
    stream: formatOut,
  },
  ],
  level: 'trace',
  src: true, // disable in production
});

function exitHandler(options, exitCode) {
  if (options === 'fatal') log.fatal(exitCode);

  for (const s in log.streams) {
    if (log.streams[s] && log.streams[s].stream) {
      try {
        log.streams[s].stream.end();
      } catch (e) {
        console.log(e);
      }
    }
  }
  fs.appendFileSync('error.log', `{status: "Process got terminated! Logging data might be incomplete",time: "${Date.now()}"}"\n`);
}

process.on('exit', exitHandler.bind(null, {
  cleanup: true,
}));
process.on('uncaughtException', exitHandler.bind('fatal', {
  cleanup: false,
}));

module.exports = log;
