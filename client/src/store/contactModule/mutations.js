/*
export const addContactToListMutation = (state, data) => {
  console.log('contactModule/mutations.js/addContactToListMutation: ' + data)
  // state.tempContacts = JSON.parse(JSON.stringify(data))
  // Object.assign(state.formContact, data)
  state.contacts.push(data)
}
*/
export const newContactSaveFormValuesMutation = (state, data) => {
  console.log('contactModule/mutations.js/newContactSaveFormValuesMutation: ' + data)
  console.log(data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.formContact = JSON.parse(JSON.stringify(myData))
  // Object.assign(state.formContact, myData)
}
export const addContactToTempMemoryMutation = (state, data) => {
  console.log('contactModule/mutations.js/addContactToTempMemoryMutation: ' + data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // state.tempContacts = JSON.parse(JSON.stringify(myData))
  // Object.assign(state.formContact, myData)
  state.tempContacts.push(myData)
}
export const deleteContactOfTempMemoryMutation = (state, data) => {
  console.log('contactModule/mutations.js/deleteContactOfTempMemoryMutation: ' + data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // Je supprime de state.tempContacts le contact qui vient d'être inséré dans la DB. Pour ce faire, je cherche son index dans le tableau puis je le supprime
  state.tempContacts.splice(
    state.tempContacts.findIndex(contact => contact.rtbfLogin === myData.rtbfLogin), // Cette fonction rtourne un objet que j'ai appelé "contact" dont le "rtbfLogin" est égal à data.rtbfLogin
    1
  )
}
export const formContactMutation = (state, data) => {
  console.log('contactModule/mutations.js/formContactMutation: ' + JSON.stringify(data))
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // console.log(myData.clearForm)
  if (myData.clearForm) {
    console.log('toto')
    // state.formContact = {}
    state.formContact.firstName = ''
    state.formContact.lastName = ''
    state.formContact.rtbfLogin = ''
  } else {
    state.formContact[myData.field] = JSON.parse(JSON.stringify(myData.value))
  }
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
