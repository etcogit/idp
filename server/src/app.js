// DB ///////////////////////////////////////
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
var LogModel = require('../models/logs')
var ContributionModel = require('../models/contributions')

// SERVEUR HTTP ////////////////////////////
// var http = require('http')
// var server = http.createServer(function (request, response) {})
var app = require('express')()
var cors = require('cors')
var bodyParser = require('body-parser')
var http = require('http').Server(app)

app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// REST API //////////////////////////////////
app.get('/', function (req, res) {
  res.send('<h1>Hello World</h1>')
})

app.post('/getContacts', function (req, res) {
  console.log('REST: getContacts: ')
  // console.log(req.body)

  ContactModel
    .find(req.body.conditions, req.body.fields)
    .limit(req.body.limit)
    .sort(req.body.sort)
    .exec(function (err, results) {
      if (err) return console.error(err)
      // socket.emit('socketContactList', results)
      res.send(results)
      // console.log(JSON.stringify(results))
    })
})

app.post('/getLastSessions', function (req, res) {
  console.log('REST: getLogs: ' + JSON.stringify(req.body))

  // Cette requête cherche les dernières sessions sur chaque plateforme d'un user en excluant la session en cours
  LogModel.aggregate(
    [
      // Je cherche uniquement les documents dont le 'userRtbfLogin' est untel et dont le socketId n'est pas celui de la connexion en cours
      // { $match: { userRtbfLogin: req.body.userId, socketId: { $ne: req.body.socketId } } },
      // Je devrais pouvoir faire ma requete sur le userId plutôt que sur le userRtbfLogin, mais ça ne fonctionne pas...
      { $match: { userRtbfLogin: req.body.userRtbfLogin, socketId: { $ne: req.body.socketId } } },
      // Je trie par ordre de 'frontendTimeStamp' décroissant
      { $sort: { frontendTimeStamp: -1 } },
      // Je groupe les résultats par 'userPlatform' -> ce qui me donne donc le dernier log de tel user sur telle plateforme
      {
        $group:
          {
            _id: {
              userPlatform: '$userPlatform'
            },
            // Je m'assure de récupérer le document le plus récent du groupe -> le $sort ci-dessus ne suffit pas
            lastLogDate: { $last: '$frontendTimeStamp' },
            // Ci-dessous je dis qu'il faut mettre dans une clé 'record' le contenu complet du document
            'record': { $first: '$$ROOT' }
          }
      },
      // Optionnel: permet de ne sélectionner que certains champs dans le résultat de la requête
      {$project: {
        _id: 0,
        'socketId': '$record.socketId',
        'frontendTimeStamp': '$record.frontendTimeStamp',
        'route': '$record.route',
        'logId': '$record._id',
        'frontendAction': '$record.frontendAction',
        'userPlatform': '$record.userPlatform',
        'userDevice': '$record.userDevice'
      }}
    ], function (err, results) {
      if (err) {
        console.log(err)
        return
      }
      // console.log(results)
      res.send(results)
    }
  )
  /*
  LogModel.aggregate(
    [
      { $match: { userRtbfLogin: 'etco' } },
      { $sort: { frontendTimeStamp: -1 } },
      {
        $group:
          {
            _id: {
              userPlatform: '$userPlatform'
            },
            lastLogDate: { $last: '$frontendTimeStamp' },
            'record': { $first: '$$ROOT' }
          }
      }
    ], function (err, result) {
      if (err) {
        console.log(err)
        return
      }
      console.log(result)
    }
  )
  */
  /*
  LogModel
    .find(req.body.conditions, req.body.fields)
    .limit(req.body.limit)
    .sort(req.body.sort)
    .exec(function (err, results) {
      if (err) return console.error(err)
      // socket.emit('socketContactList', results)
      res.send(results)
      // console.log(JSON.stringify(results))
    })
  */
})

app.post('/getSession', function (req, res) {
  console.log('REST: getSession: ' + JSON.stringify(req.body))

  LogModel
    .find(req.body.conditions)
    .exec(function (err, results) {
      if (err) return console.error(err)
      res.send(results)
      // console.log(JSON.stringify(results))
    })
})

// La variable ci-dessous sert à stocker la liste des utilisateurs dans une variable plutôt qu'en DB. Ca veut dire que son contenu est perdu à chaque redémarrage du serveur
let usersThatNeedHelp = []

// SOCKET //////////////////////////////////
// Chargement de socket.io
// var io = require('socket.io').listen(server)
var io = require('socket.io')(http)

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
  console.log('SOCKET: Un client est connecté !')
  var userIpAddress = socket.request.connection.remoteAddress
  // var userIpAddress = socket.request.connection._peername
  // var userIpAddress = socket.handshake.address
  // console.log(userIpAddress)
  socket.emit('socketConnectionEstablished', true)
  socket.emit('usersThatNeedHelpList', usersThatNeedHelp)
  // console.log(JSON.stringify(socket.id))

  // En cas de déconnection
  socket.on('disconnect', function () {
    console.log('SOCKET: Client déconnecté')
    // Si la socketId est présente dans la liste des users qui demandent de l'aide, je le retire
    // console.log(usersThatNeedHelp)
    let indexOfSocketId = usersThatNeedHelp.findIndex(index => index.socketId === socket.id)
    if (indexOfSocketId >= 0) {
      usersThatNeedHelp.splice(indexOfSocketId, 1)
      // socket.emit('usersThatNeedHelpList', usersThatNeedHelp) // -> ça n'a pas de sens puisqu'il est déconnecté...
      socket.broadcast.emit('usersThatNeedHelpList', usersThatNeedHelp)
    }
    // console.log('retire: ' + socket.id)
    // console.log(usersThatNeedHelp)
  })

  // Cette méthode sert à vérifier la connexion socket pcq la connexion initiale se fait parfois trop tôt. C'est pour ça que je renvoie la même chose que pour la connexion
  socket.on('checkSocketConnexion', function () {
    console.log('SOCKET: checkSocketConnexion = ')
    socket.emit('socketConnectionEstablished', true)
    socket.emit('usersThatNeedHelpList', usersThatNeedHelp)
  })

  // Création d'un nouveau contact
  socket.on('createContact', function (payload) {
    console.log('SOCKET: createContact = ' + JSON.stringify(payload))
    var contacts = new ContactModel()
    Object.assign(contacts, payload) // Je rajoute à contact le contenu de payload en respectant la structure de l'objet

    contacts.save(function (err, result) {
      if (err) { throw err }
      console.log('Contact ' + payload.rtbfLogin + ' ajouté avec succès !')
      // Avec "broadcast", je renvoie un payload à tous les autres clients connectés
      // socket.emit('toto', payload)
      // socket.broadcast.emit('contactcreated', payload)
      // socket.emit('contactcreated', payload)
      // socket.emit('SOCKET_CONTACTCREATED', payload)
      socket.emit('socketContactCreated', result)
    })
  })

  // Récupération de tous les contacts
  socket.on('getContacts', function (payload) {
    console.log('SOCKET: getContacts: ' + JSON.stringify(payload))

    ContactModel
      .find(payload.conditions, payload.fields)
      .limit(payload.limit)
      .sort(payload.sort)
      .exec(function (err, results) {
        if (err) return console.error(err)
        socket.emit('socketContactList', results)
        console.log(JSON.stringify(results))
      })
    /*
    ContactModel.find({}, 'firstName lastName rtbfLogin', function (err, results) { // find(query, [fields], [options], callback)
      if (err) return console.error(err)
      socket.emit('socketContactList', results)
    })
    */
  })
  /*
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
  */
  // Enregistrement d'un userLog
  socket.on('saveLogAction', function (payload) {
    console.log('SOCKET: saveLogAction')
    payload.userIpAddress = userIpAddress
    var log = new LogModel()
    Object.assign(log, payload) // Je rajoute à userLog le contenu de payload en respectant la structure de l'objet
    // console.log(log)
    log.save(function (err, result) {
      if (err) { throw err }
      console.log('Log ajouté avec succès !')
      socket.emit('socketLogSaved', result)
    })
  })

  // Récupération de logs
  socket.on('getLogs', function (payload) {
    console.log('SOCKET: getLogs: ' + JSON.stringify(payload))

    LogModel
      .find(payload.conditions, payload.fields)
      .limit(payload.limit)
      .sort(payload.sort)
      .exec(function (err, results) {
        if (err) return console.error(err)
        socket.emit('socketLogsList', results)
        // console.log(results)
      })
  })

  // Ajout d'un nouvel utilisateur qui demande de l'aide
  socket.on('addUserThatNeedHelp', function (payload) {
    console.log('SOCKET: addUserThatNeedHelp: ')

    usersThatNeedHelp.push(payload)
    socket.emit('usersThatNeedHelpList', usersThatNeedHelp)
    socket.broadcast.emit('usersThatNeedHelpList', usersThatNeedHelp)
    // console.log('ajoute: ' + payload.socketId)
    console.log(usersThatNeedHelp)
  })

  // Retire de la liste, un utilisateur qui demande de l'aide
  socket.on('removeUserThatNeedHelp', function (payload) {
    console.log('SOCKET: addUserThatNeedHelp: ')

    let indexOfSocketId = usersThatNeedHelp.findIndex(index => index.socketId === payload.socketId)
    if (indexOfSocketId >= 0) {
      usersThatNeedHelp.splice(indexOfSocketId, 1)
      socket.emit('usersThatNeedHelpList', usersThatNeedHelp)
      socket.broadcast.emit('usersThatNeedHelpList', usersThatNeedHelp)
    }
  })

  // Un aidant prend en charge un aidé
  socket.on('iWillHelp', function (payload) {
    console.log('SOCKET: iWillHelp: ')
    console.log(payload)

    // Si j'ai bien un 'demandeur d'aide' connecté avec cette 'socketId'...
    let indexOfSocketId = usersThatNeedHelp.findIndex(index => index.socketId === payload.userHelped.socketId)
    if (indexOfSocketId >= 0) {
      // ... et si cet utilisateur est bien encore en attente d'aide
      if (usersThatNeedHelp[indexOfSocketId].status === 'waitingForHelp') {
        // console.log('waitingForHelp')
        // ...j'enregistre l'info dans ma liste
        usersThatNeedHelp[indexOfSocketId].userHelping = payload.userHelping
        usersThatNeedHelp[indexOfSocketId].helpingStart = new Date()
        usersThatNeedHelp[indexOfSocketId].status = 'beingHelped'
        // ...je dois ensuite créer une 'room' et y inscrire mes 2 users
        let roomName = 'helping_' + payload.userHelped.socketId
        socket.join(roomName)
        // Je demande à la personne que je vais aider de rejoindre cette room dans le but de l'aider
        socket.broadcast.to(payload.userHelped.socketId).emit('socketJoinRoom', {roomName: roomName, goal: 'help', users: payload})
        // Je renvoie à tout le monde le statut des demandes d'aide
        socket.emit('usersThatNeedHelpList', usersThatNeedHelp)
        socket.broadcast.emit('usersThatNeedHelpList', usersThatNeedHelp)
      } else if (usersThatNeedHelp[indexOfSocketId].status === 'beingHelped') {
        // console.log('beingHelped')
        // Si ce user n'est plus en attente d'aide (qqun a été plus rapide que moi pour proposer son aide)
        // J'avertis l'utilisateur que la personne est déjà en train d'être aidée
        payload.stopHelpingReason = 'userHelpedIsAlreadyBeingHelped'
        socket.emit('socketStopHelping', payload)
      }
    } else {
      // console.log('userHelpedDoesNotNeedHelpAnymore')
      // Si ce user n'est plus dans la liste des demandeurs d'aide
      // J'avertis l'aidant que la demande d'aide n'existe plus
      payload.stopHelpingReason = 'userHelpedDoesNotNeedHelpAnymore'
      socket.emit('socketStopHelping', payload)
    }
  })

  // Un user rejoint une room
  socket.on('joinSocketRoom', function (payload) {
    console.log('SOCKET: joinSocketRoom: ')
    // console.log(socket.id)
    console.log(payload)

    socket.join(payload.roomName)
    io.sockets.to(payload.roomName).emit('socketStartHelping', payload)
    // socket.emit('usersThatNeedHelpList', usersThatNeedHelp)
    // socket.broadcast.emit('usersThatNeedHelpList', usersThatNeedHelp)
    // console.log(usersThatNeedHelp)
  })

  // Un user stoppe l'aide
  socket.on('iWantToStopHelping', function (payload) {
    console.log('SOCKET: iWantToStopHelping: ')
    // console.log(socket.id)
    console.log(payload)

    // Je cherche dans la liste quel utilisateur était aidé
    let indexOfSocketId = usersThatNeedHelp.findIndex(index => index.socketId === payload.users.userHelped.socketId)
    // Je retire cette demande de ma liste
    usersThatNeedHelp.splice(indexOfSocketId, 1)
    // Je propage les modifications de la liste à tout le monde
    socket.emit('usersThatNeedHelpList', usersThatNeedHelp)
    socket.broadcast.emit('usersThatNeedHelpList', usersThatNeedHelp)
    // Je déclenche la fermeture de session chez l'aidant et l'aidé
    payload.stopHelpingReason = 'helpStoppedByUser'
    io.sockets.to(payload.roomName).emit('socketStopHelping', payload)
    // Je ferme la room (une room ne s'efface pas... on la vide)
    /*
    io.sockets.clients(payload.roomName).forEach(function (s) {
      s.leave(payload.roomName)
    })
    */
  })

  // Sync Sessions
  socket.on('syncSessions', function (payload) {
    console.log('SOCKET: syncSessions: ')
    console.log(payload)

    // J'envoie la mutation à effectuer à tous les membres de la room excepté le "sender" (grâce à "broadcast")
    socket.broadcast.to(payload.roomName).emit('socketSyncSessions', payload)
    // Pour envoyer à tous les membres de la room, il faut faire comme ci-dessous
    // io.sockets.to(payload.roomName).emit('socketSyncSessions', payload)
  })

  // Sync Routes
  socket.on('syncRoutes', function (payload) {
    console.log('SOCKET: syncRoutes: ')
    console.log(payload)

    // J'envoie la nouvelle route à tous les membres de la room excepté le "sender" (grâce à "broadcast")
    socket.broadcast.to(payload.roomName).emit('socketSyncRoutes', payload)
    // Pour envoyer à tous les membres de la room, il faut faire comme ci-dessous
    // io.sockets.to(payload.roomName).emit('socketSyncSessions', payload)
  })

  // Chat
  socket.on('chat', function (payload) {
    console.log('SOCKET: chat: ')
    console.log(payload)

    io.sockets.to(payload.roomName).emit('socketChat', payload)
    // socket.emit('usersThatNeedHelpList', usersThatNeedHelp)
    // socket.broadcast.emit('usersThatNeedHelpList', usersThatNeedHelp)
    // console.log(usersThatNeedHelp)
  })

  // Ajout d'une contribution
  socket.on('addContribution', function (payload) {
    console.log('SOCKET: addContribution: ')
    console.log(payload)

    var contributions = new ContributionModel()
    Object.assign(contributions, payload) // Je rajoute à contributions le contenu de payload en respectant la structure de l'objet
    contributions.save(function (err, result) {
      if (err) { throw err }
      console.log('Contribution ajoutée avec succès !')
      socket.emit('socketContributionAdded', result)
    })
  })
})

// LET'S GO ///////////////////////////////////
http.listen(8081)
// server.listen(8081)
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
