// import { extend } from 'quasar'
/* eslint-disable camelcase */
export const socketConnect = (state, data) => {
  console.log('globalModule/mutations.js/socketConnect: ' + data)
  state.socketConnected = data
}
export const socketDisConnect = (state, data) => {
  console.log('globalModule/mutations.js/socketDisConnect: ' + data)
  state.socketConnected = data
}
export const connectUserMutation = (state, data) => {
  console.log('globalModule/mutations.js/connectUserMutation: ' + data)
  // Object.assign(data, state.userConnected)
  state.userConnected = JSON.parse(JSON.stringify(data.value))
  // state.userConnected = extend(true, state.userConnected, data.value)
}
export const disconnectUserMutation = (state) => {
  console.log('globalModule/mutations.js/disconnectUserMutation')
  state.userConnected = {}
  state.usersForAutocomplete = []
}
export const addLogToTempMemoryMutation = (state, data) => {
  console.log('globalModule/mutations.js/addLogToTempMemoryMutation: ' + data)
  state.tempLogs.push(data)
}
/*
export const addLogToListMutation = (rootState, data) => {
  console.log('globalModule/mutations.js/addLogToListMutation: ' + JSON.stringify(data))
  // console.log(JSON.stringify(rootState))
  // rootState.dbModule.userLogs.push(data)
}
*/
export const deleteLogOfTempMemoryMutation = (state, data) => {
  console.log('globalModule/mutations.js/deleteLogOfTempMemoryMutation: ' + data)
  // Je supprime de state.tempLogs le userLog qui vient d'être inséré dans la DB. Pour ce faire, je cherche son index dans le tableau puis je le supprime
  state.tempLogs.splice(
    state.tempLogs.findIndex(userLog => userLog.tempId === data.tempId), // Cette fonction retourne un objet que j'ai appelé "userLog" dont le "tempId" est égal à data.tempId
    1
  )
}
export const jsonDebugMutation = (state, data) => {
  console.log('globalModule/mutations.js/jsonDebugMutation: ')
  // console.log(JSON.stringify(rootState))
  // rootState.dbModule.userLogs.push(data)
  state.jsonDebug = data
}
// Sert à modifier la valeur du v-model qui va afficher l'actionSheet
export const promptPreviousSessionsMutation = (state, data) => {
  console.log('globalModule/mutations.js/promptPreviousSessionsMutation: ' + JSON.stringify(data))
  state.promptPreviousSessions[data.field] = data.value
}

/* eslint-enable camelcase */
