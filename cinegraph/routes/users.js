var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var db = require("seraph")("http://localhost:7474");
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');


/* POST user login. */
router.post('/login', authenticate, function(req, res) {
   if (!user) {
      console.log("no user");
     return res.json(401, { message: 'no user' });
   }
   //user has authenticated correctly thus we create a JWT token
   var token = jwt.sign({ username: user.username}, 'SecretStory', { expiresInMinutes : 1500 });
   res.json({ token : token, user : user });
});

router.post('/register', findOrCreateUser, function(req, res) {
   if (!user) {
      console.log("no user");
     return res.json(401, { error: 'no user' });
   }
   //user has authenticated correctly thus we create a JWT token
   var token = jwt.sign({ username: user.username}, 'SecretStory', { expiresInMinutes : 1500 });
   res.json({ token : token, user : user });
});


function authenticate(req, res, next) {
  // check in neo4j if a user with username exists or not
  predicate = {'username': req.body.username};
  db.find(predicate, 'User', function (err, objs) {
      // In case of any error, return using the done method
    if (err) {
      res.json(401, {"message" : "Error with database"});
    }
      // Username does not exist, log error & redirect back
    if (objs.length == 0) {
      return res.json(401, {'message':'User Not found.'});
    }
      // User exists but wrong password, log the error
    if (!isValidPassword(objs[0], req.body.password)) {
      return res(401, {'message' :'Invalid Password'});
      // User and password both match, return user from
      // done method which will be treated like success
    }
    user = {'firstName':objs[0].firstName, 'lastName':objs[0].lastName, 'username': objs[0].username, 'id':objs[0].id}
    next();
    });
}

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}

function findOrCreateUser(req, res, next) {
  predicate = {'username': req.body.username};
  db.find(predicate, 'User', function (err, objs) {
      // In case of any error, return using the done method
    if (err){
      console.log('Error in SignUp: ' + err);
      return res.json(401, {'message' : 'error with database'});
    }
    //already exists
    if (objs.length > 0) {
      console.log('User already exists');
      return res.status(401).json({'message' : 'User Already Exists !'});
    }
    else{
      // if there is no user with that email create the user
      var user_name = req.body.username;
      var pass = createHash(req.body.password);
      var email = req.params('email');
      var firstName = req.params('firstName');
      var lastName = req.params('lastName');
      console.log("ok");

      db.save({ 'username': user_name, 'password': pass,
                'email': email, 'firstName': firstName, 'lastName': lastName},
                'User', function(err, node) {
        if (err) throw err;
        console.log("User Registration Sucessful");
        user = {'firstName':node.firstName, 'lastName':node.lastName, 'username': node.username, 'id':node.id}
        next();
      });
    }
  });
}
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = router;
