// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// http://mongoosejs.com/docs/schematypes.html
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userLogsSchema = new Schema(
  {
    date: {type: Date, default: Date.now},
    frontendtimeStamp: {type: Date, required: true},
    userId: {type: Schema.ObjectId, ref: 'contact', required: true},
    userRtbfLogin: {type: String, required: true},
    platform: Schema.Types.Mixed,
    route: {type: String, required: true, trim: true},
    frontendAction: {type: String, trim: true}, // name of the method taht emits the request to the server
    backendAction: {type: String, trim: true}, // name of the method taht recieves the request on the server
    payloadToServer: Schema.Types.Mixed, // payload envoyé au serveur
    dataBeforeAction: Schema.Types.Mixed, // to see what changed when user edits something
    dataAfterAction: Schema.Types.Mixed,
    frontendErrorMessage: Schema.Types.Mixed,
    apiSentParams: Schema.Types.Mixed,
    apiReturneddParams: Schema.Types.Mixed
  }
)

// J'ajoute des options
userLogsSchema.set('timestamps', true) // Cette option rajoute 2 champs: createdAt et updatedAt

// Export model
module.exports = mongoose.model('userLogs', userLogsSchema)
