// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// http://mongoosejs.com/docs/schematypes.html
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userLogsSchema = new Schema(
  {
    date: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'user', required: true},
    userDevice: {type: String, required: true},
    frontendRoute: {type: String, required: true},
    actionName: {type: String}, // name of the clicked button, etc...
    dataBeforeAction: Schema.Types.Mixed, // to see what changed when user edits something
    dataAfterAction: Schema.Types.Mixed,
    frontendErrorMessage: Schema.Types.Mixed,
    apiSentParams: Schema.Types.Mixed,
    apiReturneddParams: Schema.Types.Mixed
  }
)

// Export model
module.exports = mongoose.model('userLogs', userLogsSchema)
