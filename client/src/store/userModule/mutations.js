/*
export const getLogsMutation = (rootState, data) => {
  console.log('userModule/mutations.js/getLogsMutation')
  // Object.assign(state.userLogs, data)
  rootState.dbModule.userLogs = JSON.parse(JSON.stringify(data))
}
*/
/*
// Quand le serveur me confirme que le log est sauvé
export const userLogSaved = (data) => {
  // Je sauvegarde le log dans mon state
  // Je supprime le log stocké dans la mémoire tampon locale
}
*/
// Quand le serveur me confirme que le log est sauvé
export const hasAvatarImgMutation = (state, data) => {
  console.log('userModule/mutations.js/hasAvatarImgMutation: ' + data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  if (typeof myData === 'boolean') {
    state.hasAvatarImg = myData
  } else {
    state.hasAvatarImg = !state.hasAvatarImg
  }
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
