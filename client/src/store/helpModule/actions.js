import Vue from 'vue'

export const iNeedHelpAction = ({ dispatch, commit }, data) => {
  console.log('helpModule/actions.js/iNeedHelpAction')
  // J'informe le serveur que je veux de l'aide
  dispatch('dbModule/addUserThatNeedHelpAction', data, {root: true})
  // J'affiche le bouton qui permet d'annuler ma demande
  commit('iNeedHelpMutation', data)
  // Je ferme le rightDrawer
  commit('globalModule/rightDrawerOpenMutation', true, { root: true })
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/iNeedHelpAction', backendAction: '', payloadToServer: ''}, {root: true})
}
export const iNeedHelpCancelAction = ({ dispatch, commit }, data) => {
  console.log('helpModule/actions.js/iNeedHelpCancelAction')
  // Je supprime du serveur ma demande
  dispatch('dbModule/removeUserThatNeedHelpAction', data, {root: true})
  // Je supprime le bouton qui permet d'annuler ma demande
  commit('iNeedHelpMutation', false)
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
    // Je vérifie s'il y a encore des utilisateurs qui ont besoin d'aide ou pas
    let indexOfWaitingForHelp = data.findIndex(index => index.status === 'waitingForHelp')
    // S'il n'y a plus d'user en 'waitingForHelp', alors je neutralise l'affichage qui permet d'aider (bouton dans la toolbar, affichage des demandeurs d'aide, etc...)
    if (indexOfWaitingForHelp === -1) {
      commit('usersNeedHelpMutation', false)
    } else { // S'il y a encore des users en "waitingForHelp", alors...
      // ... je passe à true la variable qui me sert à modifier le bouton "help" pour signifier que des utilisateurs demandent de l'aide ainsi que l'affichage de la liste des demandeurs d'aide dans le tiroir de droite
      commit('usersNeedHelpMutation', true)
    }
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
  // Je set 'sessionSharing' qui permet l'affichage de l'alerte permanente de partage de session et qui va déclencher la propagation de toutes les actions chez l'autre utilisateur
  commit('sessionSharingMutation', true)
  // Je stocke les infos dans le state
  commit('usersMutation', data.users)
  commit('roomNameMutation', data.roomName)
  // Je charge la session (rootState) pour que l'aidant et l'aidé soient synchro
  dispatch('globalModule/loadSessionAction', data, { root: true })
  // J'arrête le loading
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/startHelpingAction', backendAction: '', payloadToServer: ''}, {root: true})
}
// Action qui déclenche le processus d'arrêt de l'aide
export const stopHelpingAction = ({ dispatch, commit, rootState }, data) => {
  console.log('helpModule/actions.js/stopHelpingAction')
  console.log(data)
  // Si la cause de l'arrêt d'aide est que l'aidé reçoit déjà l'aide d'un autre (j'ai été trop lent à proposer mon aide)
  if (data.stopHelpingReason === 'userHelpedIsAlreadyBeingHelped') {
    // Je notifie l'aidant et le remercie
    Vue.prototype.$q.notify({
      color: Vue.prototype.$appConfig.helpModule.notify.userHelpedIsAlreadyBeingHelped.color,
      position: 'top',
      message: data.userHelped.fullName + Vue.prototype.$appConfig.helpModule.notify.userHelpedIsAlreadyBeingHelped.message,
      icon: Vue.prototype.$appConfig.helpModule.notify.userHelpedIsAlreadyBeingHelped.icon
    })
    // Je nettoie les valeurs liées à l'aide
    dispatch('clearHelpValuesAction')
  } else if (data.stopHelpingReason === 'userHelpedDoesNotNeedHelpAnymore') {
    // Si la cause de l'arrêt d'aide est que l'aidé ne demande plus d'aide (sa session a été coupée ou il a annulé sa demande)
    // Je notifie l'aidant et le remercie
    Vue.prototype.$q.notify({
      color: Vue.prototype.$appConfig.helpModule.notify.userHelpedDoesNotNeedHelpAnymore.color,
      position: 'top',
      message: Vue.prototype.$appConfig.helpModule.notify.userHelpedDoesNotNeedHelpAnymore.message,
      icon: Vue.prototype.$appConfig.helpModule.notify.userHelpedDoesNotNeedHelpAnymore.icon
    })
    // Je nettoie les valeurs liées à l'aide
    dispatch('clearHelpValuesAction')
  } else if (data.stopHelpingReason === 'helpStoppedByUser') {
    // Si la cause de l'arrêt d'aide est que l'aide a aboutit (un des 2 users a cliqué sur le bouton)
    // Je set 'sessionSharing' qui gère l'affichage de l'alerte permanente de partage de session et qui va déclenchait la propagation de toutes les actions chez l'autre utilisateur
    commit('sessionSharingMutation', false)
    // Si je suis le userHelped, j'affiche le formulaire d'évaluation du userHelping
    if (data.users.userHelped.userId === rootState.globalModule.userConnected._id) {
      commit('promptRatingHelpMutation', true)
    } else if (data.users.userHelping.userId === rootState.globalModule.userConnected._id) {
      // Si je suis le userHelping, je recharge la dernière session avant la prise en charge de l'aide
      // ... et j'affiche un q-notify "merci"
      Vue.prototype.$q.notify({
        color: Vue.prototype.$appConfig.helpModule.notify.helpStoppedByUser.color,
        position: 'top',
        message: Vue.prototype.$appConfig.helpModule.notify.helpStoppedByUser.message,
        icon: Vue.prototype.$appConfig.helpModule.notify.helpStoppedByUser.icon
      })
      // Je nettoie les valeurs liées à l'aide
      dispatch('clearHelpValuesAction')
    }
    // Je set 'sessionSharing' qui gère l'affichage de l'alerte permanente de partage de session et qui va déclenchait la propagation de toutes les actions chez l'autre utilisateur
    commit('sessionSharingMutation', false)
  }
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/stopHelpingAction', backendAction: '', payloadToServer: ''}, {root: true})
}
export const ratingHelpValidateAction = ({ dispatch, commit, state, rootState }) => {
  console.log('helpModule/actions.js/ratingHelpValidateAction')
  // Je récupère la valeur de l'évaluation de l'aidant et je l'enregistre en DB
  // J'attribue 1 point pour avoir aidé qqun
  // 2 points si la résolution a été trouvée avec l'aide d'autres personnes
  // 3 points si c'est moi qui ai trouvé la résolution
  let values = {}
  if (state.ratingHelp === 'heFoundSolution') {
    values.score = 3
  } else if (state.ratingHelp === 'weFoundSolution') {
    values.score = 2
  } else {
    values.score = 1
  }
  values.details = {
    ratingHelp: state.ratingHelp,
    helpedUserId: rootState.globalModule.userConnected._id
  }
  values.type = 'userHelping'
  values.group = 'help'
  values.userId = state.users.userHelping.userId
  values.userRtbfLogin = state.users.userHelping.userRtbfLogin
  dispatch('dbModule/addContributionAction', values, {root: true})
  // Je récupère les valeurs de contribution de l'utilisateur et je les enregistre en DB
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/ratingHelpValidateAction', backendAction: '', payloadToServer: ''}, {root: true})
}
export const contributionAddedAction = ({ dispatch, commit, state, rootState }) => {
  console.log('helpModule/actions.js/contributionAddedAction')

  // Je notifie l'aidant et le remercie
  Vue.prototype.$q.notify({
    color: Vue.prototype.$appConfig.helpModule.notify.userHelpedContributed.color,
    position: 'top',
    message: Vue.prototype.$appConfig.helpModule.notify.userHelpedContributed.message,
    icon: Vue.prototype.$appConfig.helpModule.notify.userHelpedContributed.icon
  })
  // Je retire le formulaire d'évaluation d'aide...
  commit('promptRatingHelpMutation', false)
  // ... et je nettoie les valeurs du formulaire
  commit('ratingHelpMutation', '')
  commit('ratingHelpStepMutation', 'first')
  commit('wichHelpContributionMutation', [])
  // Je nettoie les valeurs liées à l'aide
  dispatch('clearHelpValuesAction')
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/contributionAddedAction', backendAction: '', payloadToServer: ''}, {root: true})
}
export const clearHelpValuesAction = ({ dispatch, commit, state, rootState }) => {
  console.log('helpModule/actions.js/clearHelpValuesAction')
  // Je réinitialise certaines valeurs liées à l'aide
  commit('roomNameMutation', '')
  commit('sessionSharingMutation', false) // Normalement ça a déjà été traité en amont
  commit('usersMutation', {})
  dispatch('globalModule/saveLogAction', {frontendAction: 'helpModule/actions.js/clearHelpValuesAction', backendAction: '', payloadToServer: ''}, {root: true})
}
