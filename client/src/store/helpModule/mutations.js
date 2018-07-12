// Sert à modifier la valeur du v-model qui va afficher le rightDrawer
export const waysToContactMeMutation = (state, data) => {
  console.log('helpModule/mutations.js/waysToContactMeMutation: ')
  // state.rightDrawerOpen = data
  state.waysToContactMe = data
}
// Sert à modifier la valeur du v-if qui va afficher le bouton permettant d'annuler la demande d'aide
export const iNeedHelpMutation = (state, data) => {
  console.log('helpModule/mutations.js/iNeedHelpMutation: ')
  if (typeof data === 'boolean') {
    state.iNeedHelp = data
  } else {
    state.iNeedHelp = !state.iNeedHelp
  }
}
// Sert à modifier la valeur de la variable qui va modifier le bouton permettant d'apporter son aide
export const usersNeedHelpMutation = (state, data) => {
  console.log('helpModule/mutations.js/usersNeedHelpMutation: ')
  if (typeof data === 'boolean') {
    state.usersNeedHelp = data
  } else {
    state.usersNeedHelp = !state.usersNeedHelp
  }
}
// Sert à modifier la valeur de la variable qui indique que j'aide ou que je suis aidé
export const helpingMutation = (state, data) => {
  console.log('helpModule/mutations.js/helpingMutation: ')
  if (typeof data === 'boolean') {
    state.helping = data
  } else {
    state.helping = !state.helping
  }
}
// Sert à modifier la valeur de la variable qui indique que j'aide ou que je suis aidé
export const usersMutation = (state, data) => {
  console.log('helpModule/mutations.js/usersMutation: ')
  state.users = data
}
// Sert à modifier la valeur de la variable qui indique que j'aide ou que je suis aidé
export const roomNameMutation = (state, data) => {
  console.log('helpModule/mutations.js/roomNameMutation: ' + data)
  state.userHelping = data
}
