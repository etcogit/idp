export const isUserConnected = (state) => {
  if (state.userConnected.hasOwnProperty('_id')) {
    console.log('globalModule/getters.js/isUserConnected: false')
    return false
  } else {
    console.log('globalModule/getters.js/isUserConnected: true')
    return true
  }
}
