import Vue from 'vue'
import router from '../../router'
import { extend } from 'quasar'

// Exemple de méthode qui appelle cette action:
// this.saveLogAction({frontendAction: 'createContact', backendAction: 'createContact', payloadToServer: this.newContact})
export const saveLogAction = ({ commit, rootState }, data) => {
  // console.log(rootState.globalModule.bool)
  // Je n'enregistre des logs que s'il y a un utilisateur connecté
  if (rootState.globalModule.userConnected.hasOwnProperty('_id')) {
    console.log('userModule/actions.js/saveLogAction: ')
    // Je rajoute à data des informations "automatiques"
    data.frontendTimeStamp = Date() // met sert aussi de clé unique pour ma requête avec le serveur
    data.socketId = Vue.prototype.$socket.id
    data.userId = rootState.globalModule.userConnected._id
    data.userRtbfLogin = rootState.globalModule.userConnected.rtbfLogin
    data.userPlatform = rootState.globalModule.userPlatform
    data.route = router.history.current.fullPath // me permet de récupérer le "path" de l'url
    data.rootState = extend(true, data.rootState, rootState) // Je copie aussi le rootState...
    for (var key in data.rootState.dbModule) {
      // skip loop if the property is from prototype
      if (data.rootState.dbModule.hasOwnProperty(key)) {
        data.rootState.dbModule[key].results = []
      }
    }
    // delete data.rootState.dbModule // ... mais pas le contenu du state "dbModule" puisque toutes ses infos se trouvent dans la DB
    let fieldsToStringify = Vue.prototype.$appConfig.db.logs.fieldsToStringify
    // console.log('fieldsToStringify = ' + JSON.stringify(fieldsToStringify))
    for (var i = 0; i < fieldsToStringify.length; i++) {
      // console.log('fieldsToStringify = ' + fieldsToStringify[i])
      data[fieldsToStringify[i]] = JSON.stringify(data[fieldsToStringify[i]])
    }
    // Je sauvegarde le log dans la mémoire tampon locale (en cas d'erreur ou de déconnexion avec le serveur, je garde un historique des actions)
    commit('addLogToTempMemoryMutation', data)
    // J'envoie la requete au serveur
    Vue.prototype.$socket.emit('saveLogAction', data)
    // return data
    console.log(Vue.prototype.$socket)
  }
}
export const connectUserAction = ({ dispatch, commit, state }, data) => {
  console.log('globalModule/actions.js/connectUserAction: ' + data)
  // J'enregistre mon user dans le store
  commit('connectUserMutation', data)
  // Je vais chercher les dernières sessions de mon user
  dispatch('dbModule/getLastSessionsAction', data, {root: true})
  dispatch('globalModule/saveLogAction', {frontendAction: 'globalModule/actions.js/connectUserAction'}, {root: true})
}
export const disconnectUserAction = ({ dispatch, commit, state }) => {
  console.log('globalModule/actions.js/disconnectUserAction')
  commit('disconnectUserMutation')
  dispatch('globalModule/saveLogAction', {frontendAction: 'globalModule/actions.js/disconnectUserAction'}, {root: true})
}
export const checkUserConnection = ({ commit, state }, data) => {
  if (state.userConnected) {

  }
}
