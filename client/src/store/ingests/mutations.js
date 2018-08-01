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
export const updateMyIngests = (state, data) => {
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.myIngests = myData
}
export const currentIngestInit = (state, data) => {
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.ingests.currentIngest = JSON.parse(JSON.stringify(state.ingests.emptyPattern)) // Je copie le "emptyPattern"
  state.ingests.currentIngest.ingestCreator = this.loggedUser
  state.ingests.currentIngest.ingestCreationDate = new Date()
  state.ingests.currentIngest.ingestCreationDateHuman = myFormatDate(state.ingests.currentIngest.ingestCreationDate)
  for (var key in myData) {
    state.ingests.currentIngest[key] = myData[key]
  }
}
export const currentIngestAddFile = (state, data) => {
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // console.log(payload.newFile)
  state.ingests.currentIngest.files.push(myData.newFile)
  state.ingests.currentIngest.ingestTotalSize += myData.newFile.size
  state.ingests.currentIngest.ingestTotalSizeHuman = humanStorageSize(state.ingests.currentIngest.ingestTotalSize)
}
export const currentIngestUploadStatusUpdate = (state, data) => {
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.ingests.currentIngest.ingestUploadStatus = myData
}

/* ///////////////////////////////////////////////////////////////
state.socketConnection
/////////////////////////////////////////////////////////////// */
// Le serveur m'informe que je suis connecté
export const SOCKET_CONNECT = (state, data) => {
  // let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  console.log('imConnected = true')
  state.socketConnection.imConnected = true
}
// Le serveur m'informe que je suis déconnecté
export const SOCKET_DISCONNECT = (state, data) => {
  // let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.socketConnection.imConnected = false
}
/* ///////////////////////////////////////////////////////////////
state.user
/////////////////////////////////////////////////////////////// */
export const connectUser = (state, data) => {
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // console.log('connectUser')
  state.user.rtbfLogin = myData.rtbfLogin
  state.user.firstName = myData.firstName
  state.user.lastName = myData.lastName
}

/* ///////////////////////////////////////////////////////////////
state.contact
/////////////////////////////////////////////////////////////// */
// Quand un contact a été inséré dans la DB le serveur me préviens et je mets à jour ma liste de contacts
export const SOCKET_CONTACT_CREATED = (state, data) => {
  console.log('socket contact created')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // state.contacts.rtbfLogin = myData.rtbfLogin
  // state.contacts.firstName = myData.firstName
  // state.contacts.lastName = myData.lastName
  Object.keys(myData).forEach(function (key) {
    state.contacts[key] = myData[key]
  })
}

function getDataIfSyncSessions (data) {
  // ---- si on est en mode "syncSessions", les données du payload sont dans un sous-objet "data.data"
  let myData = null
  if (data.hasOwnProperty('data')) {
    myData = data.data
  } else {
    myData = data
  }
  return myData
  // ----
}
