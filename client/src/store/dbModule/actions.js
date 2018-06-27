import Vue from 'vue'
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
  // Liste des champs que je veux récupérer
  if (data.sort && data.sort !== '') {
    query.sort = data.sort
  }
  Vue.prototype.$socket.emit('getLogs', query)
  commit('saveLastRequest', {db: 'dbLogs', requestType: 'lastGetRequest', request: query})
  console.log(JSON.stringify(query))
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/getLogsAction', backendAction: 'getLogs', payloadToServer: query}, {root: true})
}
export const keepDbLogsAction = ({ commit, dispatch }, data) => {
  console.log('dbModule/actions.js/keepDbLogsAction')
  // commit('globalModule/jsonDebugMutation', data, { root: true })
  commit('keepDbLogsMutation', data)
  dispatch('globalModule/saveLogAction', {frontendAction: 'dbModule/actions.js/keepDbLogsAction'}, {root: true})
}
export const getContactsAction = ({ state, commit }, data) => { // Je devrais plutôt gérer de l'auto-complétion
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
  commit('saveLastRequest', {db: 'dbContacts', requestType: 'lastGetRequest', request: query})
  // state.dbContacts.lastGetRequest.date = new Date()
  // state.dbContacts.lastGetRequest.request = query
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
