console.log('hello')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()
app.use(morgan('combine'))
app.use(bodyParser.json())
app.use(cors())

var ressources = require('../routes/ressources') // Import routes for "/ressources"

app.use('/ressources', ressources) // Add /ressources routes to middelware chain

// Je me connecte à ma DB chez mlab.com:
// DB name: idp
// DB User: etcolab
// DB Pass: etcolab
var mongoDB = 'mongodb://etcomlab:etcomlab@ds231559.mlab.com:31559/idp'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/status', (req, res) => {
  res.send({
    message: 'hello world!'
  })
})

/*
mongoose.connect('mongodb://etcomlab:etcomlab@ds231559.mlab.com:31559/idp', function (err, db) {
  if (err) {
    console.log('Impossible de se connecter à la db', err)
  } else {
    console.log('Connexion à la DB effectuée avec succès')
    var collection = db.collection('users')
    collection.find({}).toArray(function (err, result) {
      if (err) {
        // res.send(err)
        console.log(err)
      } else if (result.length) {
        console.log(result)
      } else {
        console.log('No documents found')
      }
    })
  }
})
*/
/*
mongoose.connection.once('open', function () {
  console.log('Connection Estabilished')
})
*/

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at ' + host + port)
})
