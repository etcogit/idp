import Vue from 'vue'
export const createContactAction = ({ dispatch, commit, state, rootState }) => {
  console.log('contactModule/actions.js/createContactAction')
  // console.log(JSON.stringify(data))
  // Je rajoute l'ID du user connecté
  commit('formContactMutation', {field: 'createdBy', value: rootState.globalModule.userConnected._id})
  // J'enregistre dans un state les valeurs encodées par l'utilisateur jusqu'à ce que j'aie la confirmation que l'insertion en DB est OK
  commit('addContactToTempMemoryMutation', state.formContact)
  // J'envoie la requête au serveur
  Vue.prototype.$socket.emit('createContact', state.formContact)
  // J'enregistre l'action dans les logs
  dispatch('globalModule/saveLogAction', {frontendAction: 'contactModule/actions.js/createContactAction', backendAction: 'createContact', payloadToServer: state.formContactMutation}, {root: true})
  // data = {}
  // Je nettoie les données encodées par l'uitilisateur que je stockais temporairement dans le state pour pouvoir les ré-afficher quand on quittait le composant puis qu'on y revenait
  commit('formContactMutation', {clearForm: true}) // Je nettoie ces mêmes valeurs dans le state
}
export const getContactsAction = ({ dispatch }, data) => {
  console.log('contactModule/actions.js/getContactsAction')
  Vue.prototype.$socket.emit('getContacts', data)
  dispatch('globalModule/saveLogAction', {frontendAction: 'contactModule/actions.js/getContactsAction', backendAction: 'getContacts', payloadToServer: data}, {root: true})
}
