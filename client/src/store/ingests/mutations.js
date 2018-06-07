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
