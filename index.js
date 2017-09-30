'use strict';

let Url = require('url');

let plugin = {
  register: function(server, options, next) {
    server.ext('onRequest', function (request, reply) {
      let defaultOpts = {https: true };// default www redirects
      let opts = Object.assign(defaultOpts, options); 
      let host = request.headers.host;
      let protocol = request.connection.info.protocol;
      let redirect = false;

      if((opts.www && !/^www\./.test(host)) || (opts.nonwww && /^www\./.test(host))) {
          host = opts.www ? 'www.' + host : host.replace(/^www\./, '');
          redirect = true;
      }
      
      // https redirects
      if(opts.https && protocol === 'http'){
          protocol = 'https';
          redirect = true;
      }

      if (redirect) {
              return reply()
                  .redirect(Url.format({protocol: protocol, hostname: host, pathname: request.url.pathname, search: request.url.search}))
                  .code(301);
      }

      reply.continue();
  });
  next();
  },
};

plugin.register.attributes = {
  pkg: require('./package.json')
};

module.exports = plugin; 
