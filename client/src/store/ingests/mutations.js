import { format, date } from 'quasar' // etco: j'importe un "utils Quasar" dans la variable "format"
const { humanStorageSize } = format // etco: Je récupère la méthode "humanStorageSize" dans les "utils" de Quasar stockés dans "format" lors de l'import
const { formatDate } = date

// etco: myFormatDate
var myFormatDate = function (dateToFormat) {
  var formatedDate = formatDate(dateToFormat, 'D MMMM YYYY', {
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  })
  return formatedDate
}

/*
export const someMutation = (state) => {}
*/
// Si je dois rajouter une propriété à mon state, mieux vaut préférer cette syntaxe:
// state.obj = { ...state.obj, newProp: 123 }

/* ///////////////////////////////////////////////////////////////
state.ingests
/////////////////////////////////////////////////////////////// */
export const updateMyIngests = (state, myVariable) => {
  state.myIngests = myVariable
}
export const currentIngestInit = (state, initVars) => {
  state.ingests.currentIngest = JSON.parse(JSON.stringify(state.ingests.emptyPattern)) // Je copie le "emptyPattern"
  state.ingests.currentIngest.ingestCreator = this.loggedUser
  state.ingests.currentIngest.ingestCreationDate = new Date()
  state.ingests.currentIngest.ingestCreationDateHuman = myFormatDate(state.ingests.currentIngest.ingestCreationDate)
  for (var key in initVars) {
    state.ingests.currentIngest[key] = initVars[key]
  }
}
export const currentIngestAddFile = (state, payload) => {
  // console.log(payload.newFile)
  state.ingests.currentIngest.files.push(payload.newFile)
  state.ingests.currentIngest.ingestTotalSize += payload.newFile.size
  state.ingests.currentIngest.ingestTotalSizeHuman = humanStorageSize(state.ingests.currentIngest.ingestTotalSize)
}
export const currentIngestUploadStatusUpdate = (state, value) => {
  state.ingests.currentIngest.ingestUploadStatus = value
}

/* ///////////////////////////////////////////////////////////////
state.socketConnection
/////////////////////////////////////////////////////////////// */
// Le serveur m'informe que je suis connecté
export const SOCKET_CONNECT = (state, value) => {
  console.log('imConnected = true')
  state.socketConnection.imConnected = true
}
// Le serveur m'informe que je suis déconnecté
export const SOCKET_DISCONNECT = (state, value) => {
  state.socketConnection.imConnected = false
}
/* ///////////////////////////////////////////////////////////////
state.user
/////////////////////////////////////////////////////////////// */
export const connectUser = (state, value) => {
  // console.log('connectUser')
  state.user.rtbfLogin = value.rtbfLogin
  state.user.firstName = value.firstName
  state.user.lastName = value.lastName
}

/* ///////////////////////////////////////////////////////////////
state.contact
/////////////////////////////////////////////////////////////// */
// Quand un contact a été inséré dans la DB le serveur me préviens et je mets à jour ma liste de contacts
export const SOCKET_CONTACT_CREATED = (state, value) => {
  console.log('socket contact created')
  // state.contacts.rtbfLogin = value.rtbfLogin
  // state.contacts.firstName = value.firstName
  // state.contacts.lastName = value.lastName
  Object.keys(value).forEach(function (key) {
    state.contacts[key] = value[key]
  })
}
