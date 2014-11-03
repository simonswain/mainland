module.exports = function(env){

  if(!env){
    env = 'development';
  }

  var prefix = 'mb:' + env;

  var redis = {
    host: '127.0.0.1',
    port: 6379,
  };

  var server = {
    host: '127.0.0.1',
    port: 6002
  };

  switch ( env ) {
  case 'test' :
    server.port = 6003;
    break;

  case 'development' :
    server.port = 6002;
    break;

  case 'production' :
    server.port = 6001;
    break;
  }

  return {
    prefix: prefix,
    env: env,
    redis: redis,
    server: server
  };

};
