console.log('hello')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

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

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
