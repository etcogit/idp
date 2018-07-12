import Vue from 'vue'

export const iNeedHelpAction = ({ dispatch, commit }, data) => {
  console.log('helpModule/actions.js/iNeedHelpAction')
  // J'informe le serveur que je veux de l'aide
  dispatch('dbModule/addUserThatNeedHelpAction', data, {root: true})
  // J'affiche le bouton qui permet d'annuler ma demande
  commit('iNeedHelpMutation')
  // Je ferme le rightDrawer
  commit('globalModule/rightDrawerOpenMutation', true, { root: true })
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/iNeedHelpAction', backendAction: '', payloadToServer: ''}, {root: true})
}
export const iNeedHelpCancelAction = ({ dispatch, commit }, data) => {
  console.log('helpModule/actions.js/iNeedHelpCancelAction')
  // Je supprime du serveur ma demande
  dispatch('dbModule/removeUserThatNeedHelpAction', data, {root: true})
  // Je supprime le bouton qui permet d'annuler ma demande
  commit('iNeedHelpMutation')
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/iNeedHelpCancelAction', backendAction: '', payloadToServer: ''}, {root: true})
}
export const keepUsersThatNeedHelpAction = ({ dispatch, commit, rootState, state }, data) => {
  console.log('helpModule/actions.js/keepUsersThatNeedHelpAction')
  // console.log(data)
  // Si la liste ne contient aucun user (si toutes les demandes ont été retirées ou traitées), je ré-initialise tout
  if (data.length === 0) {
    commit('usersNeedHelpMutation', false)
    commit('iNeedHelpMutation', false) // à priori pas nécessaire mais au moins je m'assure qu'il n'y a plus rien qui traine
  } else {
    // Si ma socketId est dans les demandeurs, je neutralise le fait de pouvoir m'aider depuis le même socketId
    let indexOfMySocketId = data.findIndex(index => index.socketId === Vue.prototype.$socket.id)
    if (indexOfMySocketId >= 0) {
      data[indexOfMySocketId].disable = true
    }
    // Si j'ai une demande en cours et que je n'apparais pas dans la liste, je supprime ma demande en cours -> c'est qu'elle a disparu pour une bonne raison ;-) comme par exemple perdre ma connexion au serveur, ce qui kill ma demande d'aide
    if (state.iNeedHelp === true && indexOfMySocketId === -1) {
      commit('iNeedHelpMutation', false)
    }
    // Je passe à true la variable qui me sert à modifier le bouton "help" pour signifier que des utilisateurs demandent de l'aide
    commit('usersNeedHelpMutation', true)
    // console.log('!!!!!!!!!! data: ' + data.length + ' results: ' + rootState.dbModule.listUsersThatNeedHelp.results.length)
    if (data.length > rootState.dbModule.listUsersThatNeedHelp.results.length) {
      // J'affiche une notification pour attirer l'attention sur le fait qu'une nouvelle personne vient de demander de l'aide
      // let singOuPlur = data.length === 1 ? Vue.prototype.$appConfig.idp_home.notify.usersThatNeedHelp.messageSingulier : Vue.prototype.$appConfig.idp_home.notify.usersThatNeedHelp.messagePluriel
      Vue.prototype.$q.notify({
        color: Vue.prototype.$appConfig.global.color.help.primaryColor,
        position: 'top',
        message: data.length + (data.length === 1 ? Vue.prototype.$appConfig.idp_home.notify.usersThatNeedHelp.messageSingulier : Vue.prototype.$appConfig.idp_home.notify.usersThatNeedHelp.messagePluriel),
        icon: Vue.prototype.$appConfig.idp_home.notify.usersThatNeedHelp.icon
      })
    }
  }
  // J'enregistre la liste des usersThatNeedHelp que j'ai reçue du serveur
  commit('dbModule/keepUsersThatNeedHelpMutation', data, {root: true})
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/keepUsersThatNeedHelpAction', backendAction: '', payloadToServer: ''}, {root: true})
}
export const startHelpingAction = ({ dispatch, commit }, data) => {
  console.log('helpModule/actions.js/startHelpingAction')
  console.log(data)
  // Je set 'helping' qui permet l'affichage de l'alerte permanente de partage de session et qui va déclencher la propagation de toutes les actions chez l'autre utilisateur
  commit('helpingMutation', true)
  // Je stocke les infos dans le state
  commit('usersMutation', data.users)
  commit('roomNameMutation', data.roomName)
  // Je charge la session (rootState) pour que l'aidant et l'aidé soient synchro
  // J'arrête le loading
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/startHelpingAction', backendAction: '', payloadToServer: ''}, {root: true})
}
export const stopHelpingAction = ({ dispatch, commit }, data) => {
  console.log('helpModule/actions.js/stopHelpingAction')
  // Je préviens le serveur pour qu'il mette à jour la liste des demandes d'aides
  // Si je suis l'aidant, je recharge la dernière session avant la prise en charge de l'aide
  // ... et j'affiche un q-notify "merci"
  // Si je suis l'aidé, je nettoie tout ce qui était relatif à l'aide
  // ... je set 'helping' qui permet l'affichage de l'alerte permanente de partage de session et qui va déclencher la propagation de toutes les actions chez l'autre utilisateur
  commit('helpingMutation', false)
  // ... j'affiche une modale avec un formulaire de "vote" pour qualifier l'aide fournie
  // ... j'arrête le loading
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/stopHelpingAction', backendAction: '', payloadToServer: ''}, {root: true})
}
