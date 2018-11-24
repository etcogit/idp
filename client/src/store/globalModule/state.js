import { Platform } from 'quasar'

export default {
  socketConnected: false,
  userConnected: {},
  userPlatform: Platform,
  userDevice: {},
  // Liste des logs du user connecté dont l'insertion en DB n'a pas été confirmée
  tempLogs: [],
  jsonDebug: null,
  promptUserDeviceName: false,
  promptUserConnection: false,
  promptPreviousSessions: {
    vmodel: false, // v-model pour l'action sheet qui propose la liste des dernières sessions de l'utilisateur
    sessionsList: []
  },
  leftDrawerOpen: true,
  rightDrawerOpen: false
}
