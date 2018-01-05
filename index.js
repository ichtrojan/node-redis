const express = require('express');
const path = require('path');
const async = require('async');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// Create Redis Client
let client = redis.createClient();

client.on('connect', function(){
  console.log('Connected to Redis...');
});

// Set Port
const PORT = 3000;

// Init app
const app = express();

// body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// methodOverride
app.use(methodOverride('_method'));

app.get('/', function(req, res, next){
  res.send('node-redis CRUD Application');
});

app.get('/users', function (req, res, next) {
  client.hgetall("2", function (err, reply) {
    res.send(reply);
  });
});

//Add User
app.post('/user/add', function(req, res, next){
  let id = req.body.id;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let phone = req.body.phone;

  client.hmset(id,[
    'first_name', first_name,
    'last_name', last_name,
    'email', email,
    'phone', phone
  ], function(err, reply){
    if(err){
      console.log(err);
    }
    console.log(reply);
    res.send('User added successfully');
  });
});

//Delete User
app.delete('/user/delete/:id', function(req, res, next){
  client.del(req.params.id);
  res.send('User deleted successfully');
});

//Get by id
app.get('/user/:id', function(req, res, next){
  let id = req.params.id;
  client.hgetall(id, function(err, obj){
    if(!obj){
      res.send('User does not exist');
    }else {
      obj.id = id;
      res.send({'user': obj});
    }
  });
});

app.put('/user/update/:id', function(req, res, next){
  let id = req.params.id;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let phone = req.body.phone;

  client.hmset(id, [
    'first_name', first_name,
    'last_name', last_name,
    'email', email,
    'phone', phone
  ], function(err, reply){
    if(err){
      console.log(err);
    }
    console.log(reply);
    res.send("User updated successfully");
  });
})

app.listen(PORT, function(){
  console.log('Server started on port ' + PORT);
});
