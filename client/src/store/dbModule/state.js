export default {
  // Liste des contacts dans la DB
  dbContacts: {
    results: [],
    lastPostRequest: {
      date: '',
      request: {}
    },
    lastGetRequest: {
      date: '',
      request: {}
    }
  },
  // Liste des users qui demandent de l'aide
  listUsersThatNeedHelp: {
    results: [],
    lastPostRequest: {
      date: '',
      request: {}
    },
    lastGetRequest: {
      date: '',
      request: {}
    }
  },
  // Liste des contributions
  dbContributions: {
    results: [],
    lastPostRequest: {
      date: '',
      request: {}
    },
    lastGetRequest: {
      date: '',
      request: {}
    }
  },
  // Liste des users que je propose dans ma popup de connexion -> noramelement pas besoin à la RTBF car autologin
  /*
  dbUsersForAutocomplete: {
    results: [],
    lastPostRequest: {
      date: '',
      request: {}
    },
    lastGetRequest: {
      date: '',
      request: {}
    }
  },
  */
  // Liste des logs de l'utilisateur
  dbLogs: {
    results: [],
    lastGetRequest: {
      date: '',
      requestQuery: {},
      requestProtocol: '',
      requestBackendAction: ''
    }
  }
}
