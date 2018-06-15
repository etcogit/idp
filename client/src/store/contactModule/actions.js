/*
export const createContact = (newContact) => {
  console.log('contactModule/action.js/createContact')
  this.saveUserLog({})
  // this.createContact(JSON.parse(JSON.stringify(this.newContact)))
  // J'enregistre dans un state les valeurs encodées par l'utilisateur jusqu'à ce que j'aie la confirmation que l'insertion en DB est OK
  this.addContactToTempMemory(this.newContact)
  this.newContact.createdBy = this.userConnected._id
  // this.$socket.emit('createContact', this.newContact)
  this.newContact = {} // Je nettoie les valeurs dans les champs (v_model)
  this.newContactSaveFormValues({}) // Je nettoie ces mêmes valeurs dans le state
}

export const createContact = ({ commit }, data) => {
  console.log('contactModule/action.js/createContact: ' + data)
  commit('addContactToTempMemory', data)
  this._vm.$socket.emit('createContact', data)
}
*/
