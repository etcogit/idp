import Vue from 'vue'
// import { extend } from 'quasar'
/* eslint-disable camelcase */
export const socketConnect = (state, data) => {
  console.log('globalModule/mutations.js/socketConnect: ' + data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.socketConnected = myData
}
export const socketDisConnect = (state, data) => {
  console.log('globalModule/mutations.js/socketDisConnect: ' + data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.socketConnected = myData
}
export const connectUserMutation = (state, data) => {
  console.log('globalModule/mutations.js/connectUserMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // Object.assign(myData, state.userConnected)
  state.userConnected = JSON.parse(JSON.stringify(myData.value))
  // state.userConnected = extend(true, state.userConnected, myData.value)
}
export const disconnectUserMutation = (state) => {
  console.log('globalModule/mutations.js/disconnectUserMutation')
  state.userConnected = {}
  state.promptUserConnection = true
  // state.usersForAutocomplete = []
}
export const addLogToTempMemoryMutation = (state, data) => {
  if (Vue.prototype.$appConfig.global.console.logs === true) {
    console.log('globalModule/mutations.js/addLogToTempMemoryMutation: ' + data)
  }
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.tempLogs.push(myData)
}
/*
export const addLogToListMutation = (rootState, data) => {
  console.log('globalModule/mutations.js/addLogToListMutation: ' + JSON.stringify(data))
  // console.log(JSON.stringify(rootState))
  // rootState.dbModule.userLogs.push(data)
}
*/
export const deleteLogOfTempMemoryMutation = (state, data) => {
  if (Vue.prototype.$appConfig.global.console.logs === true) {
    console.log('globalModule/mutations.js/deleteLogOfTempMemoryMutation: ' + data)
  }
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // Je supprime de state.tempLogs le userLog qui vient d'être inséré dans la DB. Pour ce faire, je cherche son index dans le tableau puis je le supprime
  state.tempLogs.splice(
    state.tempLogs.findIndex(userLog => userLog.tempId === myData.tempId), // Cette fonction retourne un objet que j'ai appelé "userLog" dont le "tempId" est égal à data.tempId
    1
  )
}
export const jsonDebugMutation = (state, data) => {
  console.log('globalModule/mutations.js/jsonDebugMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // console.log(JSON.stringify(rootState))
  // rootState.dbModule.userLogs.push(data)
  state.jsonDebug = myData
}
// Sert à modifier la valeur du v-model qui va afficher l'actionSheet
export const promptPreviousSessionsMutation = (state, data) => {
  console.log('globalModule/mutations.js/promptPreviousSessionsMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.promptPreviousSessions[myData.field] = myData.value
}
// Sert à modifier la valeur du v-model qui va afficher le leftDrawer
export const leftDrawerOpenMutation = (state, data) => {
  console.log('globalModule/mutations.js/leftDrawerOpenMutation: ')
  // console.log(data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  if (typeof myData === 'boolean') {
    state.leftDrawerOpen = myData
  } else {
    state.leftDrawerOpen = !state.leftDrawerOpen
  }
}
// Sert à modifier la valeur du v-model qui va afficher le rightDrawer
export const rightDrawerOpenMutation = (state, data) => {
  console.log('globalModule/mutations.js/rightDrawerOpenMutation: ')
  // console.log(data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  if (typeof myData === 'boolean') {
    state.rightDrawerOpen = myData
  } else {
    state.rightDrawerOpen = !state.rightDrawerOpen
  }
}
// Sert à modifier la valeur du userDevice qui est le nom donné par le user pour identifier la machine sur laquelle il est connecté
export const userDeviceMutation = (state, data) => {
  console.log('globalModule/mutations.js/userDeviceMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // console.log('$$$$$$$$$$$$$$$$$ myData = ')
  // console.log(myData)
  state.userDevice = myData
}
// Sert à modifier la valeur du promptUserConnection qui conditionne l'affichage du formulaire modal de connection d'utilisateur
export const promptUserConnectionMutation = (state, data) => {
  console.log('globalModule/mutations.js/promptUserConnectionMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  if (typeof myData === 'boolean') {
    state.promptUserConnection = myData
  } else {
    state.promptUserConnection = !state.promptUserConnection
  }
}
// Sert à modifier la valeur du promptUserDeviceName qui conditionne l'affichage du formulaire d'identification du device
export const promptUserDeviceNameMutation = (state, data) => {
  console.log('globalModule/mutations.js/promptUserDeviceNameMutation: ')
  console.log(data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  if (typeof myData === 'boolean') {
    state.promptUserDeviceName = myData
  } else {
    state.promptUserDeviceName = !state.promptUserDeviceName
  }
}
// Sert à modifier la valeur du v-model qui gère la navigation -> surtout utile lors de "syncSessions"
export const navigationVModelMutation = (state, data) => {
  console.log('globalModule/mutations.js/navigationVModelMutation: ')
  // console.log(data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.navigationVModel = myData
}

function getDataIfSyncSessions (data) {
  // ---- si on est en mode "syncSessions", les données du payload sont dans un sous-objet "data.data"
  let myData = null
  if (data.hasOwnProperty('data')) {
    myData = data.data
  } else {
    myData = data
  }
  return myData
  // ----
}
/* eslint-enable camelcase */
