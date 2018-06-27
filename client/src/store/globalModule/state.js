import { Platform } from 'quasar'

export default {
  socketConnected: false,
  userConnected: {},
  userPlatform: Platform,
  // Liste des logs du user connecté dont l'insertion en DB n'a pas été confirmée
  tempLogs: [],
  jsonDebug: null
}
