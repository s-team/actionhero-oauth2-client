var OAuth2 = require('simple-oauth2');
var events = require('events');
var util   = require('util');

var OAuth2Client = module.exports = function(config){
  var self = this;
  
  this.id = config.id;
  this.secret = config.secret;

  this.site               = config.site;
  this.authorizationPath  = config.authorizationPath || '/api/oauth/authorize';
  this.tokenPath          = config.tokenPath || '/api/oauth/access_token';
  
  this.scope = config.scope | '';  
  this.action = config.action || 'oauth';
            
  this.oauth = new OAuth2({
    clientID:     this.id,
    clientSecret: this.secret,
  
    site:               this.site,
    authorizationPath:  this.authorizationPath,
    tokenPath:          this.tokenPath
  });  
  
  
  this.initializer = function(api, next){
    
    api.oauth2 = self;
      
    self.createOAuth2Action(api);      
    //to rebuild the required and optional params for the dummy action...
    api.params.buildPostVariables();    
    
    self.protocol = api.config.servers['web'].secure ? 'https' : 'http';
        
    next();
  }; 
};


util.inherits(OAuth2Client, events.EventEmitter);


OAuth2Client.prototype.redirectToLogin = function(connection){
  
  var req = connection.rawConnection.req;
  var res = connection.rawConnection.res;
  
  if(!this.redirect_url){
    this.redirect_url = this.protocol + "://" + req.headers.host + '/api/' + this.action;  
  }
  
  //redirect to oauth2 server
  res.writeHead(303, {Location: this.getAuthorizationUrl()});
  res.end();
};


OAuth2Client.prototype.getAuthorizationUrl = function(){
  if(!this.authorization_url){
    this.authorization_url = this.oauth.AuthCode.authorizeURL({
      redirect_uri: this.redirect_url,
      scope: this.scope
    });
  }
  
  return this.authorization_url;
}


OAuth2Client.prototype.createOAuth2Action = function(api){

  var action = require('./actions/oauth');
  
  action.name = this.action;
  
  //oauth action to allow /api/oauth
  api.actions.versions[this.action] = [action.version];
  api.actions.actions[this.action] = {};
  api.actions.actions[this.action][action.version] = action;
};