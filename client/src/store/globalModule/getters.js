export const isUserConnected = (state) => {
  if (state.userConnected.hasOwnProperty('id')) {
    return true
  } else {
    return false
  }
}
