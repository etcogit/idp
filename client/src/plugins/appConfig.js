// import something here

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$appConfig = {
    restApiUrl: 'https://idp-etcocloud9.c9users.io:8081',
    db: {
      logs: {
        fieldsToStringify: [
          'userPlatform',
          'rootState',
          'payloadToServer',
          'dataBeforeAction',
          'dataAfterAction',
          'frontendErrorMessage'
        ],
        maxLimitResults: 100
      },
      contacts: {
        maxLimitResults: 100
      }
    },
    promptPreviousSessions: {
      title: 'Continuer la session précédente ?'
    },
    modalUserConnection: {
      title: 'Auto-login ;-)',
      placeholder: 'qui es-tu ?'
    },
    idp_home: {
      toolbar: {
        title: 'IntraProd',
        subtitle: 'NUMPROD everywhere',
        icon: 'menu',
        help: {
          icon: 'help_outline'
        }
      },
      leftDrawer: {
        listHeader: 'Outils'
      }
    }
  }
}
