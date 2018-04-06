'use strict'

let Url = require('url')

let plugin = {
  register: function (server, options) {
    server.ext('onRequest', function (request, h) {
      let defaultOpts = { https: true }// default www redirects
      let opts = Object.assign(defaultOpts, options)
      let host = request.headers.host
      let protocol = request.server.info.protocol
      let forwardedProtocol = request.headers['x-forwarded-proto']
      let isHttpProtocol = opts.proxy ? forwardedProtocol === 'http' : protocol === 'http'
      let redirect = false

      if ((opts.www && !/^www\./.test(host)) || (opts.nonwww && /^www\./.test(host))) {
        host = opts.www ? 'www.' + host : host.replace(/^www\./, '')
        redirect = true
      }

      // https redirects
      if (opts.https && isHttpProtocol) {
        protocol = 'https'
        redirect = true
      }

      if (redirect) {
        return h
                  .redirect(Url.format({protocol: protocol, hostname: host, pathname: request.url.pathname, search: request.url.search}))
                  .takeover()
                  .code(301)
      }

      return h.continue
    })
  // next();
  }
}

plugin.pkg = require('./package.json')

module.exports = plugin
