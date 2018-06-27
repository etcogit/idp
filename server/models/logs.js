// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// http://mongoosejs.com/docs/schematypes.html
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var logsSchema = new Schema(
  {
    date: {type: Date, default: Date.now},
    frontendTimeStamp: {type: Date, required: true},
    socketId: {type: String, required: true},
    userId: {type: Schema.ObjectId, ref: 'contact', required: true},
    userRtbfLogin: {type: String, required: true},
    userPlatform: {type: String}, // JSON stocké en text pour full text search
    userIpAddress: {type: String, required: true},
    route: {type: String, required: true, trim: true},
    rootState: {type: String}, // JSON stocké en text pour full text search
    frontendAction: {type: String, trim: true}, // name of the method taht emits the request to the server
    backendAction: {type: String, trim: true}, // name of the method taht recieves the request on the server
    payloadToServer: {type: String}, // payload envoyé au serveur -> JSON stocké en text pour full text search
    dataBeforeAction: {type: String}, // to see what changed when user edits something -> JSON stocké en text pour full text search
    dataAfterAction: {type: String}, // JSON stocké en text pour full text search
    frontendErrorMessage: {type: String}, // JSON stocké en text pour full text search
    apiSentParams: {type: String}, // JSON stocké en text pour full text search
    apiReturneddParams: {type: String} // JSON stocké en text pour full text search
  }
)

// J'ajoute des options
logsSchema.set('timestamps', true) // Cette option rajoute 2 champs: createdAt et updatedAt

// Export model
module.exports = mongoose.model('userLogs', logsSchema)
