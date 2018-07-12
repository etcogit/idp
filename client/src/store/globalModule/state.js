import { Platform } from 'quasar'

export default {
  socketConnected: false,
  promptUserConnection: false,
  userConnected: {},
  userPlatform: Platform,
  promptUserDeviceName: false,
  userDevice: {},
  // Liste des logs du user connecté dont l'insertion en DB n'a pas été confirmée
  tempLogs: [],
  jsonDebug: null,
  promptPreviousSessions: {
    vmodel: false, // v-model pour l'action sheet qui propose la liste des dernières sessions de l'utilisateur
    sessionsList: []
  },
  rightDrawerOpen: false
}
