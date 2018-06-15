import Vue from 'vue'
import router from '../../router'

// Exemple de méthode qui appelle cette action:
// this.saveUserLog({frontendAction: 'createContact', backendAction: 'createContact', payloadToServer: this.newContact})
export const saveUserLog = ({ commit, rootState }, data) => {
  // console.log(rootState.globalModule.bool)
  if (rootState.globalModule.userConnected.hasOwnProperty('id')) {
    console.log('userLogModule/action.js/saveUserLog: ' + data)
    // Je rajoute à data des informations "automatiques"
    data.frontendtimeStamp = Date() // met sert aussi de clé unique pour ma requête avec le serveur
    data.userId = rootState.globalModule.userConnected._id
    data.userRtbfLogin = rootState.globalModule.userConnected.rtbfLogin
    data.plaform = rootState.globalModule.platform
    data.route = router.history.current.fullPath // me permet de récupérer le "path" de l'url
    // Je sauvegarde le log dans la mémoire tampon locale (en cas d'erreur ou de déconnexion avec le serveur, je garde un historique des actions)
    commit('addUserLogToTempMemory', data)
    // J'envoie la requete au serveur
    Vue.prototype.$socket.emit('saveUserLog', data)
    // return data
  }
}
