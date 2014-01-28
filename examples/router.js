var Router = require('../index').Router;

var routes = {   
 "samples": ["left","middle","right"]
}

var router = new Router(
  {
    routes: routes
  }, 
  function(msg, done){
    console.log(topic, msg);
    done();
  });

router.listen();
