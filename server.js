let express = require('express')
let path = require('path')
let bodyParser = require('body-parser')
let methodOverride = require('method-override')
let redis = require('redis')
let client = redis.createClient()

// define routes
let routes = require('./Routes/api')

// Set Port
let PORT = 4040

// Init app
let app = express()

// instantiate a connection to redis 
client.on('connect', () => {
  console.log('Connected to Redis...')
})

// body-parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// methodOverride
app.use(methodOverride('_method'))

// Routes Middleware
app.use(routes)

// 404 handler
app.use((req, res) => {
  res.status(404)
  res.send('endpoint not found')
})

// serve application on specified port
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT)
});

module.exports = app
