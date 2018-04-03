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

app.get('/status', (req, res) => {
  res.send({
    message: 'hello world!'
  })
})

// app.set('port', process.env.PORT || 8081)

// app.listen(process.env.PORT || 8081)

// mongoose.connect('mongodb://' + process.env.IP + ':28017/db/idp', function (err, db) {
var myHost = encodeURIComponent('0.0.0.0:27017/idp')
console.log(myHost)
// mongoose.connect('mongodb://' + process.env.IP + ':27017/idp', function (err, db) {
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

/*
mongoose.connection.once('open', function () {
  console.log('Connection Estabilished')
})
*/

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
