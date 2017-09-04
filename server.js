let Hapi = require('hapi');

// create new server instance
let server = new Hapi.Server();

// add server’s connection information
server.connection({
  host: 'localhost',
  port: 4000,
});

// register plugins to server instance
server.register({  
  register: require('./hapi-gate.js')
});

// start your server
server.start(function(err) {
  if (err) {
    throw err;
  }

  console.log('Server running at: ' + server.info.uri);
});
