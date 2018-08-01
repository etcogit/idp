export default {
  usersNeedHelp: false,
  iNeedHelp: false,
  waysToContactMe: ['jabber', 'gsm', 'chat', 'session'],
  sessionSharing: false, // variable qui spécifie si je suis en mode de partage de session ou pas: ce sera true si je suis en train d'aider ou si je suis en train de me faire aider
  users: {},
  roomName: '',
  promptRatingHelp: false,
  ratingHelp: '', // c'est le v-model du formulaire d'évaluation de l'aide
  ratingHelpStep: 'first', // C'est le v-model du 'q-stepper' du formulaire d'évaluation de l'aide
  wichHelpContribution: []
}
