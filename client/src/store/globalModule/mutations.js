/* eslint-disable camelcase */
export const socketConnect = (state, data) => {
  console.log('mutations.js/socketConnect: ' + data)
  state.socketConnected = data
}
export const socketDisConnect = (state, data) => {
  console.log('mutations.js/socketDisConnect: ' + data)
  state.socketConnected = data
}
/* eslint-enable camelcase */
