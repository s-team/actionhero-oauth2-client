module.exports = {
  name: 'oauth',
  version: 2,
  description: 'OAuth2 Client',
  inputs: { required: ['code'], optional: ['error'] },
  outputExample: {},
  requireAuth: false,
  run: function(api, connection, next){
    var code = connection.params.code;
  
    api.oauth2.oauth.AuthCode.getToken({
      code: code,
      redirect_uri: api.oauth2.redirect_url
    }, function (error, result) {
      if(error){ 
        api.oauth2.emit('unauthorized', api, connection, next);
      }else{    
        connection.params.access_token = api.oauth2.oauth.AccessToken.create(result).token.access_token;
        api.oauth2.emit('authorized', api, connection, next);                            
      }          
    });
    
  }
};