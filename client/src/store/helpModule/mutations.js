// Sert à modifier la valeur du v-model qui va afficher le rightDrawer
export const waysToContactMeMutation = (state, data) => {
  console.log('helpModule/mutations.js/waysToContactMeMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  // state.rightDrawerOpen = myData
  state.waysToContactMe = myData
}
// Sert à modifier la valeur du v-if qui va afficher le bouton permettant d'annuler la demande d'aide
export const iNeedHelpMutation = (state, data) => {
  console.log('helpModule/mutations.js/iNeedHelpMutation: ')
  console.log(data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  if (typeof myData === 'boolean') {
    state.iNeedHelp = myData
  } else {
    state.iNeedHelp = !state.iNeedHelp
  }
}
// Sert à modifier la valeur de la variable qui va modifier le bouton permettant d'apporter son aide
export const usersNeedHelpMutation = (state, data) => {
  console.log('helpModule/mutations.js/usersNeedHelpMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  if (typeof myData === 'boolean') {
    state.usersNeedHelp = myData
  } else {
    state.usersNeedHelp = !state.usersNeedHelp
  }
}
// Sert à modifier la valeur de la variable qui indique que la session est partagée
export const sessionSharingMutation = (state, data) => {
  console.log('helpModule/mutations.js/sessionSharingMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  if (typeof myData === 'boolean') {
    state.sessionSharing = myData
  } else {
    state.sessionSharing = !state.sessionSharing
  }
}
// Sert à modifier la valeur de la variable qui stocke les données des users "helped" et "helping"
export const usersMutation = (state, data) => {
  console.log('helpModule/mutations.js/usersMutation: ')
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.users = myData
}
// Sert à modifier la valeur de la variable qui stocke la "roomName"
export const roomNameMutation = (state, data) => {
  console.log('helpModule/mutations.js/roomNameMutation: ')
  // console.log(data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.roomName = myData
}
// Sert à modifier la valeur de la variable qui gère l'affichage du modal d'évaluation de l'aide reçue
export const promptRatingHelpMutation = (state, data) => {
  console.log('helpModule/mutations.js/promptRatingHelpMutation: ' + data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  if (typeof myData === 'boolean') {
    state.promptRatingHelp = myData
  } else {
    state.promptRatingHelp = !state.promptRatingHelp
  }
}
// Sert à modifier la valeur du formulaire "radioButton" qui permet d'évaluer un collègue pour son aide
export const ratingHelpMutation = (state, data) => {
  console.log('helpModule/mutations.js/ratingHelpMutation: ' + data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.ratingHelp = myData
}
// Sert à modifier la valeur du v-model du 'q-stepper' du formulaire d'évaluation d'aide
export const ratingHelpStepMutation = (state, data) => {
  console.log('helpModule/mutations.js/ratingHelpStepMutation: ' + data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  state.ratingHelpStep = myData
}
// Sert à modifier la valeur du v-model du 'q-group' (checkboxes) du formulaire d'évaluation d'aide
export const wichHelpContributionMutation = (state, data) => {
  console.log('helpModule/mutations.js/wichHelpContributionMutation: ' + data)
  let myData = getDataIfSyncSessions(data) // Si je suis en mode "syncSessions", les datas sont dans un sous objet data.data
  let indexNothing = myData.findIndex(element => element === 'nothing')
  // console.log(indexNothing)
  if (indexNothing !== -1) { // Si 'nothing' est coché...
    if (myData.length === 1) { // ... et qu'il n'y a QUE nothing de coché
      state.wichHelpContribution = myData
    } else { // ... et qu'il n'y a PAS que nothing qui est coché
      if (indexNothing === 0) { // Si l'utilisateur avait coché "Rien" et qu'il veut cocher autre chose (en gros si "Rien" est le premier élément de la liste)
        // Je retire 'nothing' de la liste
        myData.splice(0, 1)
        state.wichHelpContribution = myData
      } else if (indexNothing > 0) {
        // Je ne laisse QUE 'nothing'
        state.wichHelpContribution = ['nothing']
        // console.log(state.wichHelpContribution)
      }
    }
  } else { // Si 'nothing' n'est pas coché, je garde les valeurs cochées telles quelles
    state.wichHelpContribution = myData
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
