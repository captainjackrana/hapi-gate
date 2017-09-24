hapi-gate
==================

> A lightweight hapi plugin that adds basic redirections to your server ( http -> https and www/non-www redirects)

As a default, any incoming http request will be redirected **(301)** to the same host and path with `https` as the protocol. 
Highly influenced from [hapi-require-https](https://github.com/bendrucker/hapi-require-https). If you're only looking for https redirections, you can use that plugin..

## Usage

[Load the plugin](http://hapijs.com/tutorials/plugins#loading-a-plugin) as you would normally do and we're set!

```js
server.register({
  register: require('hapi-gate'),
  options: {https: true,
            www: true} // will force https and www on all requests
})
```

#### options

##### **https**

Type: `boolean`  
Default: `true`

Indicates whether the server should redirect any non-https calls to the https protocol

##### **www**

Type: `boolean`  
Default: `false`

Indicates whether the server should redirect any non-www requests to the www subdomain. For instance, after setting this to true, a request made to `https://example.com` will be redirected (301) to `https://www.example.com`

##### **nonwww**

Type: `boolean`  
Default: `false`

Indicates whether the server should redirect any www subdomain requests to the root domain. For instance, after setting this to true, a request made to `https://www.example.com` will be redirected (301) to `https://example.com`
