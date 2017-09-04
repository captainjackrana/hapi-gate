'use strict';

let test = require('tape');
let hapi = require('hapi');
let http = require('http');
let plugin = require('./');

test('default options', function(t) {
  t.plan(2);

  Server().inject({
    url: '/',
    headers: {
      "host": 'host',
    },
  }, function(response) {
    t.equal(response.statusCode, 301, 'sets 301 code');
    t.equal(response.headers.location, 'https://www.host/', 'sets Location header');
  });
});

test('www request: options = {www: false}', function(t) {
  t.plan(2);

  Server({www: false, https:false}).inject({
    url: '/',
    headers: {
      host: 'www.host',
    },
  }, function(response) {
    t.equal(response.statusCode, 301, 'sets 301 code');
    t.equal(response.headers.location, 'http://host/', 'sets Location header');
  });
});

test('www request: options = {www: true}', function(t) {
  t.plan(2);

  Server({www: true, https:false}).inject({
    url: '/',
    headers: {
      host: 'www.host',
    },
  }, function(response) {
    t.equal(response.statusCode, 200, 'receives 200');
    t.equal(response.result, 'Bingo!', 'receives body');
  });
});

test('non-www request: options = {www: true}', function(t) {
  t.plan(2);

  Server({www: true, https:false}).inject({
    url: '/',
    headers: {
      host: 'host',
    },
  }, function(response) {
    t.equal(response.statusCode, 301, 'sets 301 code');
    t.equal(response.headers.location, 'http://www.host/', 'sets Location header');
  });
});

test('non-www request: options = {www: false}', function(t) {
  t.plan(2);

  Server({www: false, https:false}).inject({
    url: '/',
    headers: {
      host: 'host',
    },
  }, function(response) {
    t.equal(response.statusCode, 200, 'receives 200');
    t.equal(response.result, 'Bingo!', 'receives body');
  });
});

test('query string', function(t) {
  t.plan(2);

  Server({www:true, https:true}).inject({
    url: '/?test=test&test2=test2',
    headers: {
      "host": 'host',
    },
  }, function(response) {
    t.equal(response.statusCode, 301, 'sets 301 code');
    t.equal(
      response.headers.location,
      'https://www.host/?test=test&test2=test2',
      'sets Location header with query string'
    );
  });
});

test('only https', function(t) {
  t.plan(2);

  Server({www:false}).inject({
    url: '/',
    headers: {
      "host": 'host',
    },
  }, function(response) {
    t.equal(response.statusCode, 301, 'sets 301 code');
    t.equal(response.headers.location, 'https://host/', 'sets Location header');
  });
});

test('https with www redirect', function(t) {
  t.plan(2);

  Server({https:true, www: true}).inject({
    url: '/',
    headers: {
      "host": 'host',
    },
  }, function(response) {
    t.equal(response.statusCode, 301, 'sets 301 code');
    t.equal(response.headers.location, 'https://www.host/', 'sets Location header');
  });
});

function Server(options) {
  let server = new hapi.Server();
  server.connection();
  server.register({register: plugin, options: options}, throwErr);
  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply('Bingo!');
    },
  });
  return server;
}

function throwErr(err) {
  if (err) throw err;
}
