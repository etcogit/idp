// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// http://mongoosejs.com/docs/schematypes.html
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema(
  {
    firstName: {type: String, required: true, max: 100, trim: true},
    lastName: {type: String, required: true, max: 100, trim: true},
    birthDate: {type: Date},
    createdDate: {type: Date, default: Date.now},
    sourceDb: {type: String, required: true, default: 'Intraprod', enum: ['OptiTime', 'Whats\'On', 'Intraprod', 'Info360']},
    sourceID: {type: String}, // L'identifiant unique de cette ressource dans la DB externe
    rtbfLogin: {type: String, required: true, max: 10, trim: true, unique: true},
    mainRtbfLocation: {type: String, required: true, default: 'BXL', enum: ['BXL', 'CHA', 'LGE', 'MONS', 'NAM']},
    email: {
      rtbf: {type: String, trim: true},
      others: [{type: String, trim: true}]
    },
    phone: {
      rtbfGsm: {type: String, trim: true},
      rtbfJabber: {type: String, trim: true},
      others: [{type: String, trim: true}]
    },
    preferences: {
      personal: {
        preferredEmail: {type: String, trim: true},
        preferredPhone: {type: String, trim: true}
      },
      gui: {
        desktop: {
          zoom: {type: Number, min: 0, max: 10},
          theme: {type: String} // classic, pink, highContrast, birthDay, season, random, etc...
        },
        tablet: {
          zoom: {type: Number, min: 0, max: 10},
          theme: {type: String}
        },
        smartphone: {
          zoom: {type: Number, min: 0, max: 10},
          theme: {type: String}
        }
      },
      notifications: {
        dailyPlanning: [{type: String}], // idpApp, sms, email, whatsApp, etc... -> plusieurs choix possibles ou empty
        weeklyPlanning: [{type: String}],
        newActivityToday: [{type: String}], // quand on affecte une activité à une personne
        embedOfficeNotifications: {type: Boolean, default: false}
      }
    }
  }
)

// Virtual for user's full name
userSchema
  .virtual('fullName')
  .get(function () {
    return this.firstName + ' ' + this.lastName
  })

// Virtual for author's URL
userSchema
  .virtual('url')
  .get(function () {
    return '/catalog/author/' + this._id
  })

// Export function to create "users" model class
module.exports = mongoose.model('users', userSchema)
