// Quand un contact a été inséré dans la DB le serveur me préviens et je mets à jour ma liste de contacts
/*
export const contactCreated = (state, data) => {
  console.log('contactModule/mutations.js/contactCreated: ' + data)
  // state.contacts.rtbfLogin = value.rtbfLogin
  // state.contacts.firstName = value.firstName
  // state.contacts.lastName = value.lastName
  Object.keys(data).forEach(function (key) {
    state.contacts[key] = data[key]
  })
}
*/
export const getContacts = (state, data) => {
  console.log('contactModule/mutations.js/getContacts: ' + data)
  // state.tempContacts = JSON.parse(JSON.stringify(data))
  // Object.assign(state.contacts, data)
  state.contacts = JSON.parse(JSON.stringify(data))
}
export const addContactToList = (state, data) => {
  console.log('contactModule/mutations.js/addContactToList: ' + data)
  // state.tempContacts = JSON.parse(JSON.stringify(data))
  // Object.assign(state.formNewContact, data)
  state.contacts.push(data)
}
export const newContactSaveFormValues = (state, data) => {
  console.log('contactModule/mutations.js/saveNewContact: ' + data)
  state.formNewContact = JSON.parse(JSON.stringify(data))
  // Object.assign(state.formNewContact, data)
}
export const addContactToTempMemory = (state, data) => {
  console.log('contactModule/mutations.js/addContactToTempMemory: ' + data)
  // state.tempContacts = JSON.parse(JSON.stringify(data))
  // Object.assign(state.formNewContact, data)
  state.tempContacts.push(data)
}
export const deleteContactOfTempMemory = (state, data) => {
  console.log('contactModule/mutations.js/deleteContactOfTempMemory: ' + data)
  // Je supprime de state.tempContacts le contact qui vient d'être inséré dans la DB. Pour ce faire, je cherche son index dans le tableau puis je le supprime
  state.tempContacts.splice(
    state.tempContacts.findIndex(contact => contact.rtbfLogin === data.rtbfLogin), // Cette fonction rtourne un objet que j'ai appelé "contact" dont le "rtbfLogin" est égal à data.rtbfLogin
    1
  )
}
