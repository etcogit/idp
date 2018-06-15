export const getUserLogs = (state, data) => {
  console.log('userModule/mutations.js/getUserLogs')
  // Object.assign(state.userLogs, data)
  state.userLogs = JSON.parse(JSON.stringify(data))
}
export const addUserLogToTempMemory = (state, data) => {
  console.log('userModule/mutations.js/addUserLogToTempMemory: ' + data)
  state.tempUserLogs.push(data)
}
export const addUserLogToList = (state, data) => {
  console.log('userModule/mutations.js/addUserLogToList: ' + data)
  state.userLogs.push(data)
}
export const deleteUserLogOfTempMemory = (state, data) => {
  console.log('userModule/mutations.js/deleteUserLogOfTempMemory: ' + data)
  // Je supprime de state.tempUserLogs le userLog qui vient d'être inséré dans la DB. Pour ce faire, je cherche son index dans le tableau puis je le supprime
  state.tempUserLogs.splice(
    state.tempUserLogs.findIndex(userLog => userLog.tempId === data.tempId), // Cette fonction retourne un objet que j'ai appelé "userLog" dont le "tempId" est égal à data.tempId
    1
  )
}
// Quand le serveur me confirme que le log est sauvé
export const userLogSaved = (data) => {
  // Je sauvegarde le log dans mon state
  // Je supprime le log stocké dans la mémoire tampon locale
}
