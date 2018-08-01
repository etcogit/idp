// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// http://mongoosejs.com/docs/schematypes.html
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var contributionsSchema = new Schema(
  {
    type: {type: String, required: true, trim: true}, // Le type de contribution: userHelping, etc...
    group: {type: String, trim: true}, // Le groupe (un groupe peut regrouper plusieurs 'types'). Ex: help, ingest
    score: {type: Number}, // Le score de cette contribution
    userId: {type: Schema.ObjectId, ref: 'contact', required: true},
    details: Schema.Types.Mixed // Stocke en vrac le contenu de la contribution
  }
)

// J'ajoute des options
contributionsSchema.set('timestamps', true) // Cette option rajoute 2 champs: createdAt et updatedAt

// Export model
module.exports = mongoose.model('contributions', contributionsSchema)
