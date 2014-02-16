# actionhero OAuth2 client

Create a OAuth2 client with actionhero

Install: 
```bash
npm install actionhero-oauth2-client
```

create a new initializer inside your actionhero project.

e.g. `oauth2.js` with the following content
```js
var OAuth2Client = require('actionhero-oauth2-client');

var client = new OAuth2Client({
  id: 'your_oauth_client_id',
  secret: 'your_oauth_secret',

  site: 'http://your_oauth2_server.com'
});

client.on('authorized', function(api, connection, next){
  var access_token = connection.params.access_token;
  //save the access token here
  next(connection, true);
});

client.on('unauthorized', function(api, connection, next){
  //authorization failed
  next(connection, true);
})

exports.oauth = client.initializer;
```

call `api.oauth2.redirectToLogin(connection);` to redirect your user to the OAuth2 server