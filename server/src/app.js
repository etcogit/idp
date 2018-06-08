const mongoose = require('mongoose')

// Je me connecte à ma DB chez mlab.com:
// DB name: idp
// DB User: etcomlab2018
// DB Pass: etcomlab2018
var mongoDB = 'mongodb://etcomlab2018:etcomlab2018@ds247270.mlab.com:47270/idp'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function () {
  // we're connected!
  console.log('MongoDB connection estabilished')
})

var ContactModel = require('../models/contact')

var http = require('http')
// Chargement du fichier index.html affiché au client
var server = http.createServer(function (request, response) {})

// Chargement de socket.io
var io = require('socket.io').listen(server)

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
  console.log('Un client est connecté !')
  socket.emit('connect', true)

  // Création d'un nouveau contact
  socket.on('createContact', function (payload) {
    console.log('createContact = ' + payload.rtbfLogin)
    /*
    var contacts = new ContactModel({
      firstName: payload.firstName,
      lastName: payload.lastName,
      rtbfLogin: payload.rtbfLogin
    })
    */
    var contacts = new ContactModel()
    contacts.rtbfLogin = payload.rtbfLogin
    contacts.firstName = payload.firstName
    contacts.lastName = payload.lastName
    /*
    user.find(function (err, users) {
      if (err) return console.error(err)
      console.log(users)
      // res.send(users)
    })
    */
    contacts.save(function (err) {
      if (err) { throw err }
      console.log('Contact ' + payload.rtbfLogin + ' ajouté avec succès !')
      // Avec "broadcast", je renvoie un payload à tous les autres clients connectés
      socket.broadcast.emit('contactcreated', payload)
      socket.emit('contactcreated', payload)
      socket.emit('SOCKET_CONTACTCREATED', payload)
      socket.emit('socket_contactCreated', payload)
      socket.emit('contactCreated', payload)
    })
  })

  // Modification d'un utilisateur existant
  socket.on('updateUser', function (payload) {
    console.log('updateUser = ' + payload.rtbfLogin)
    var user = require('../models/user')
    // var user = new UserModel({})
    user.update({ rtbfLogin: payload.rtbfLogin }, {mainRtbfLocation: payload.mainRtbfLocation}, function (err, raw) {
      if (err) { throw err }
      console.log(payload.rtbfLogin + ' modifié avec succès !')
      // Avec "broadcast", je renvoie un payload à tous les autres clients connectés
      socket.broadcast.emit('userUpdated', { login: payload.rtbfLogin })
    })
  })
})

server.listen(8081)
/*
// console.log('hello')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()
app.use(morgan('combine'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

var ressources = require('../routes/ressources') // Import routes for "/ressources"

app.use('/ressources', ressources) // Add /ressources routes to middelware chain

// Chargement de socket.io
// var io = require('socket.io').listen(server)

// Je me connecte à ma DB chez mlab.com:
// DB name: idp
// DB User: etcomlab2018
// DB Pass: etcomlab2018
var mongoDB = 'mongodb://etcomlab2018:etcomlab2018@ds247270.mlab.com:47270/idp'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function () {
  // we're connected!
  console.log('MongDB connection estabilished')
})

app.get('/', function (req, res) {
  console.log(req.body)
  res.send('Hello World')
})
app.post('/status', (req, res) => {
  console.log(req.params)
  res.send({
    message: 'hello world!',
    reqBody: req.body,
    reqParams: req.params
  })
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at ' + host + port)
})
*/
