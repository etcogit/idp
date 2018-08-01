import Vue from 'vue'
import { date } from 'quasar'
import router from '../../router'

export const getLogsAction = ({ dispatch, commit }, data) => {
  console.log('dbModule/actions.js/getLogsAction')
  let query = {}
  // Je récupère les conditions de la requête
  if (data.conditions && data.conditions !== '') {
    query.conditions = data.conditions
  }
  // Liste des champs que je veux récupérer
  if (data.fields && data.fields !== '') {
    query.fields = data.fields
  }
  // Je limite le nombre de résultats si ce n'est pas défini dans la requête
  if (data.limit && data.limit !== '') { // Si un nombre limite de résultats est spécifié et qu'il est inférieur à 100...
    if (data.limit <= Vue.prototype.$appConfig.db.logs.maxLimitResults) {
      query.limit = data.limit
    } else {
      query.limit = Vue.prototype.$appConfig.db.logs.maxLimitResults
    }
  }
  // Ordre de tri des résultats
  if (data.sort && data.sort !== '') {
    query.sort = data.sort
  }
  Vue.prototype.$socket.emit('getLogs', query)
  commit('saveLastRequest', {db: 'dbLogs', requestType: 'lastGetRequest', request: query, requestProtocol: 'socket', requestBackendAction: 'getLogs'})
  // console.log(JSON.stringify(query))
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/getLogsAction', backendAction: 'getLogs', payloadToServer: query}, {root: true})
}
export const keepDbLogsAction = ({ commit, dispatch }, data) => {
  console.log('dbModule/actions.js/keepDbLogsAction')
  // commit('globalModule/jsonDebugMutation', data, { root: true })
  commit('keepDbLogsMutation', data)
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/keepDbLogsAction'}, {root: true})
}
export const getContactsAction = ({ state, commit, dispatch }, data) => {
  console.log('dbModule/actions.js/getContactsAction')
  let query = {}
  if (data.conditions && data.conditions !== '') {
    query.conditions = data.conditions
  }
  if (data.fields && data.fields !== '') {
    query.fields = data.fields
  }
  if (data.limit && data.limit !== '') { // Si un nombre limite de résultats est spécifié et qu'il est inférieur à 100...
    if (data.limit <= Vue.prototype.$appConfig.db.contacts.maxLimitResults) {
      query.limit = data.limit
    } else {
      query.limit = Vue.prototype.$appConfig.db.contacts.maxLimitResults
    }
  }
  if (state.dbContacts.results.length === 0) {
    Vue.prototype.$socket.emit('getContacts', query)
  }
  commit('saveLastRequest', {db: 'dbContacts', requestType: 'lastGetRequest', request: query, requestProtocol: 'socket', requestBackendAction: 'getContacts'})
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/getContactsAction', backendAction: 'getContacts', payloadToServer: query}, {root: true})
  // state.dbContacts.lastGetRequest.date = new Date()
  // state.dbContacts.lastGetRequest.request = query
}
export const getLastSessionsAction = ({ commit, rootState, dispatch }, data) => {
  console.log('dbModule/actions.js/getLastSessionsAction')
  let query = {
    socketId: Vue.prototype.$socket.id,
    userId: rootState.globalModule.userConnected._id,
    userRtbfLogin: rootState.globalModule.userConnected.rtbfLogin
  }
  Vue.prototype.$axios.post('/getLastSessions', query)
    .then((response) => {
      // console.log(response)
      // Je dois convertir les données reçues vers le bon format pour mon "actionSheet"
      let sessionsList = []
      for (var i = 0; i < response.data.length; i++) {
        let device = ''
        if (response.data[i].userPlatform.indexOf('desktop') !== -1) {
          device = 'desktop_windows'
        } else if (response.data[i].userPlatform.indexOf('mobile') !== -1) {
          device = 'phone_android'
        }
        let userDeviceName = ''
        if (response.data[i].hasOwnProperty('userDevice')) {
          userDeviceName = ' - ' + response.data[i].userDevice.name
        }
        sessionsList.unshift( // unshift permet de rajouter l'élément au début de la liste, contrairement à push qui rajoute à la fin
          {
            label: date.formatDate(response.data[i].frontendTimeStamp, 'DD/MM/YYYY HH:mm:ss') + userDeviceName + ' - ' + response.data[i].route,
            icon: device,
            logId: response.data[i].logId
          }
        )
      }
      // Je retire le Splash Screen
      Vue.prototype.$q.loading.hide()
      commit('globalModule/promptPreviousSessionsMutation', {field: 'sessionsList', value: sessionsList}, {root: true})
      // Je dois afficher mon "actionSheet"
      commit('globalModule/promptPreviousSessionsMutation', {field: 'vmodel', value: true}, {root: true})
      // console.log(response)
    })
    .catch(() => {
      Vue.prototype.$q.notify({
        color: 'negative',
        position: 'top',
        message: 'La récupération des sessions précédentes a échoué',
        icon: 'report_problem'
      })
    })
  commit('saveLastRequest', {db: 'dbLogs', requestType: 'lastGetRequest', request: query, requestProtocol: 'rest', requestBackendAction: '/getLastSessions'})
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/getLastSessionsAction', backendAction: 'getLastSessions', payloadToServer: query}, {root: true})
}
// Je vais chercher le contenu d'une session à charger
export const getSessionAction = ({ dispatch, commit, rootState }, data) => {
  console.log('dbModule/actions.js/loadSessionAction: ' + JSON.stringify(data))
  let query = {conditions: {_id: data.logId}}
  Vue.prototype.$axios.post('/getSession', query)
    .then((response) => {
      // console.log(response)
      dispatch('globalModule/loadSessionAction', response.data[0], { root: true })
      /*
      // Je remet en JSON toutes les données stockées sous forme de text dans la DB à des fins de recherche full text. La liste des champs est stockée dans le plugin "appConfig"
      let fieldsToParse = Vue.prototype.$appConfig.db.logs.fieldsToStringify
      for (var i = 0; i < fieldsToParse.length; i++) {
        if (response.data[0][fieldsToParse[i]]) { // Si ce champ est dans la liste des champs à formater, alors je le fais
          // console.log('fieldsToParsee = ' + fieldsToParse[i])
          // console.log(JSON.parse(response.data[0][fieldsToParse[i]]))
          response.data[0][fieldsToParse[i]] = JSON.parse(response.data[0][fieldsToParse[i]])
        }
      }
      // Je renvoie l'utilisatuer vers la bonne page
      router.push({path: response.data[0].route})
      // J'écrase le "rootState"
      rootState = JSON.parse(JSON.stringify(response.data[0].rootState))
      // Je relance les dernières requêtes pour récupérer les data

      // commit('globalModule/promptPreviousSessionsMutation', {field: 'sessionsList', value: sessionsList}, {root: true})
      // console.log(response)
      */
    })
    .catch(() => {
      Vue.prototype.$q.notify({
        color: 'negative',
        position: 'top',
        message: 'La récupération des des données de session a échoué',
        icon: 'report_problem'
      })
    })
  commit('saveLastRequest', {db: 'dbLogs', requestType: 'lastGetRequest', request: query, requestProtocol: 'rest', requestBackendAction: '/getSession'})
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/loadSessionAction', backendAction: 'getSession', payloadToServer: query}, {root: true})
}
// Requête qui rajoute un utilisateur à la liste de ceux qui ont demandé de l'aide
export const addUserThatNeedHelpAction = ({ dispatch, commit, rootState }, data) => {
  console.log('dbModule/actions.js/addUserThatNeedHelpAction')
  let query = {
    userId: rootState.globalModule.userConnected._id,
    rtbfLogin: rootState.globalModule.userConnected.rtbfLogin,
    firstName: rootState.globalModule.userConnected.firstName,
    lastName: rootState.globalModule.userConnected.lastName,
    fullName: rootState.globalModule.userConnected.fullName,
    socketId: Vue.prototype.$socket.id,
    status: 'waitingForHelp',
    waysToContact: rootState.helpModule.waysToContactMe
  }
  Vue.prototype.$socket.emit('addUserThatNeedHelp', query)
  commit('saveLastRequest', {db: 'listUsersThatNeedHelp', requestType: 'lastPostRequest', request: query, requestProtocol: 'socket', requestBackendAction: 'addUserThatNeedHelp'})
  // console.log(JSON.stringify(query))
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/newUserNeedHelpAction', backendAction: 'addUserThatNeedHelp', payloadToServer: query}, {root: true})
}
// Requête qui retire un utilisateur de la liste de ceux qui ont demandé de l'aide
export const removeUserThatNeedHelpAction = ({ dispatch, commit, rootState }, data) => {
  console.log('dbModule/actions.js/removeUserThatNeedHelpAction')
  let query = {
    socketId: Vue.prototype.$socket.id
  }
  Vue.prototype.$socket.emit('removeUserThatNeedHelp', query)
  commit('saveLastRequest', {db: 'listUsersThatNeedHelp', requestType: 'lastPostRequest', request: query, requestProtocol: 'socket', requestBackendAction: 'removeUserThatNeedHelp'})
  // console.log(JSON.stringify(query))
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/removeUserThatNeedHelpAction', backendAction: 'removeUserThatNeedHelp', payloadToServer: query}, {root: true})
}
// Requête qui informe que je vais aider qqun
export const iWillHelpAction = ({ dispatch, commit, rootState }, data) => {
  console.log('dbModule/actions.js/iWillHelpAction')
  // console.log(data)

  let query = {
    userHelping: {
      userId: rootState.globalModule.userConnected._id,
      rtbfLogin: rootState.globalModule.userConnected.rtbfLogin,
      firstName: rootState.globalModule.userConnected.firstName,
      lastName: rootState.globalModule.userConnected.lastName,
      fullName: rootState.globalModule.userConnected.fullName,
      socketId: Vue.prototype.$socket.id
    },
    userHelped: data
  }
  Vue.prototype.$socket.emit('iWillHelp', query)
  commit('saveLastRequest', {db: 'listUsersThatNeedHelp', requestType: 'lastPostRequest', request: query, requestProtocol: 'socket', requestBackendAction: 'iWillHelp'})
  console.log(query)
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/iWillHelpAction', backendAction: 'iWillHelp', payloadToServer: query}, {root: true})
}
export const joinSocketRoomAction = ({ dispatch, commit, rootState }, data) => {
  console.log('dbModule/actions.js/joinSocketRoomAction')
  // Si la room a vocation d'aider (et pas de chatter), je rajoute le rootState aux datas à envoyer au serveur pour qu'il les transmette à l'aidant
  if (data.goal === 'help') {
    data.rootState = rootState
    data.route = router.history.current.fullPath // me permet de récupérer le "path" de l'url
  }
  Vue.prototype.$socket.emit('joinSocketRoom', data)
  commit('saveLastRequest', {db: 'listUsersThatNeedHelp', requestType: 'lastPostRequest', request: data, requestProtocol: 'socket', requestBackendAction: 'joinSocketRoom'})
  // console.log(JSON.stringify(query))
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/joinSocketRoomAction', backendAction: 'joinSocketRoom', payloadToServer: data}, {root: true})
}
export const iWantToStopHelpingAction = ({ dispatch, commit, rootState }, data) => {
  console.log('dbModule/actions.js/iWantToStopHelpingAction')
  let query = {users: rootState.helpModule.users}
  query.roomName = rootState.helpModule.roomName
  Vue.prototype.$socket.emit('iWantToStopHelping', query)
  commit('saveLastRequest', {db: 'listUsersThatNeedHelp', requestType: 'lastPostRequest', request: query, requestProtocol: 'socket', requestBackendAction: 'iWantToStopHelping'})
  // console.log(JSON.stringify(query))
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/iWantToStopHelpingAction', backendAction: 'iWantToStopHelping', payloadToServer: query}, {root: true})
}
export const addContributionAction = ({ dispatch, commit }, data) => {
  console.log('dbModule/actions.js/addContributionAction')
  let query = data
  Vue.prototype.$socket.emit('addContribution', query)
  commit('saveLastRequest', {db: 'dbContributions', requestType: 'lastPostRequest', request: query, requestProtocol: 'socket', requestBackendAction: 'addContribution'})
  // console.log(JSON.stringify(query))
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/addContributionAction', backendAction: 'addContribution', payloadToServer: query}, {root: true})
}
// Je propage les mutations à synchroniser avec la session de l'autre utilisateur
export const syncSessionsSendAction = ({ rootState }, data) => {
  console.log('dbModule/actions.js/syncSessionsSendAction')
  // console.log(data)
  let query = JSON.parse(JSON.stringify(data))
  query.roomName = rootState.helpModule.roomName
  // console.log(query)
  Vue.prototype.$socket.emit('syncSessions', query)

  // dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/syncSessionsSendAction', backendAction: 'syncSessions', payloadToServer: data}, {root: true})
}
// Je propage les changements de 'route'
export const syncRoutesSendAction = ({ dispatch, commit, rootState }, data) => {
  console.log('dbModule/actions.js/syncRoutesSendAction')
  // console.log(data)
  let query = {
    from: {
      fullPath: data.from.fullPath,
      hash: data.from.hash,
      meta: data.from.meta,
      name: data.from.name,
      params: data.from.params,
      path: data.from.path,
      query: data.from.query
    },
    to: {
      fullPath: data.to.fullPath,
      hash: data.to.hash,
      meta: data.to.meta,
      name: data.to.name,
      params: data.to.params,
      path: data.to.path,
      query: data.to.query
    },
    roomName: rootState.helpModule.roomName
  }

  console.log(query)
  Vue.prototype.$socket.emit('syncRoutes', query)
  // Vue.prototype.$socket.emit('syncSessions', query)
  return true

  // dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/syncSessionsSendAction', backendAction: 'syncSessions', payloadToServer: data}, {root: true})
}

/*
export const getLogsAction = ({ dispatch }, data) => {
  console.log('dbModule/actions.js/getLogsAction')
  // let query = {conditions: {$text: {$search: data.searchFullText}, 'createdAt': {'$gte': data.startSearchDate, '$lte': data.endSearchDate}}, limit: 100, sort: '-createdAt'}
  // let query = {conditions: {'createdAt': {'$gte': data.startSearchDate, '$lte': data.endSearchDate}}, limit: 100, sort: '-createdAt'}
  let query = {conditions: {}, limit: '', sort: '-createdAt'}
  if (data.searchFullText && data.searchFullText !== '') { // S'il y a une chaine de caractère dans le champ "search" alors je dois faire la rechereche full text
    query.conditions.$text = {$search: data.searchFullText}
  }
  // S'il y a des dates
  if ((data.startSearchDate && data.startSearchDate !== '') || (data.endSearchDate && data.endSearchDate !== '')) {
    query.conditions.createdAt = {} // Je crée la key qui correspond au champ "createdAt" -> il y a peut-être un autre moyen de le faire...
    if (data.startSearchDate !== '') { // S'il y a une date début encodée...
      query.conditions.createdAt.$gte = data.startSearchDate
    }
    if (data.endSearchDate !== '') { // S'il y a une date de fin encodée...
      query.conditions.createdAt.$lte = data.endSearchDate
    }
  }
  if (data.userId && data.userId !== '') { // Si on cherche les logs d'un utilisateur en particulier...
    query.conditions.userId = data.userId
  }
  if (data.limit && data.limit !== '') { // Si un nombre limite de résultats est spécifié et qu'il est inférieur à 100...
    if (data.limit <= Vue.prototype.$appConfig.db.logs.maxLimitResults) {
      query.limit = data.limit
    } else {
      query.limit = Vue.prototype.$appConfig.db.logs.maxLimitResults
    }
  }
  Vue.prototype.$socket.emit('getLogs', query)
  console.log(JSON.stringify(query))
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/getLogsAction', backendAction: 'getLogs', payloadToServer: query}, {root: true})
}
*/
