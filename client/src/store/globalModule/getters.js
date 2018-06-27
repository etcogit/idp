export const isUserConnected = (state) => {
  console.log('globalModule/getters.js/isUserConnected: ')
  if (state.userConnected.hasOwnProperty('_id')) {
    return false
  } else {
    return true
  }
}
