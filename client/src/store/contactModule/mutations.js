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
  state.formContact = JSON.parse(JSON.stringify(data))
  // Object.assign(state.formContact, data)
}
export const addContactToTempMemoryMutation = (state, data) => {
  console.log('contactModule/mutations.js/addContactToTempMemoryMutation: ' + data)
  // state.tempContacts = JSON.parse(JSON.stringify(data))
  // Object.assign(state.formContact, data)
  state.tempContacts.push(data)
}
export const deleteContactOfTempMemoryMutation = (state, data) => {
  console.log('contactModule/mutations.js/deleteContactOfTempMemoryMutation: ' + data)
  // Je supprime de state.tempContacts le contact qui vient d'être inséré dans la DB. Pour ce faire, je cherche son index dans le tableau puis je le supprime
  state.tempContacts.splice(
    state.tempContacts.findIndex(contact => contact.rtbfLogin === data.rtbfLogin), // Cette fonction rtourne un objet que j'ai appelé "contact" dont le "rtbfLogin" est égal à data.rtbfLogin
    1
  )
}
export const formContactMutation = (state, data) => {
  console.log('contactModule/mutations.js/formContactMutation: ' + JSON.stringify(data))
  // console.log(data.clearForm)
  if (data.clearForm) {
    console.log('toto')
    // state.formContact = {}
    state.formContact.firstName = ''
    state.formContact.lastName = ''
    state.formContact.rtbfLogin = ''
  } else {
    state.formContact[data.field] = JSON.parse(JSON.stringify(data.value))
  }
}
