// import something here

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$appConfig = {
    restApiUrl: 'https://idp-etcocloud9.c9users.io:8081',
    global: {
      color: {
        help: {
          primaryColor: 'purple',
          bgPrimaryColor: 'bg-purple text-white',
          textPrimaryColor: 'text-purple',
          textOnPrimaryColor: 'white',
          primaryColorInverted: 'white',
          textPrimaryColorInverted: 'text-white',
          textOnPrimaryColorInverted: 'purple'
        }
      },
      console: {
        logs: false
      },
      avatar: {
        bgColor: 'secondary',
        textColor: 'white'
      }
    },
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
    idp_home: {
      toolbar: {
        title: 'IntraProd',
        subtitle: 'NUMPROD everywhere',
        icon: 'menu',
        help: {
          icon: 'help_outline'
        },
        user: {
          icon: 'account_box',
          me: {
            icon: 'exit_to_app',
            tooltip: 'Me déconnecter'
          },
          device: {
            sublabel: 'Nom de l\'appareil'
          }
        }
      },
      leftDrawer: {
        listHeader: 'Outils'
      },
      rightDrawer: {
        help: {
          accordion: {
            usersNeedHelp: {
              accordionLabel: 'Proposer mon aide',
              accordionIcon: 'directions_run',
              beingHelped: 'directions_run'
            },
            iNeedHelp: {
              accordionLabel: 'Demander de l\'aide aux utilisateurs connectés',
              accordionIcon: 'chat',
              waysToContactMe: {
                formLabel: 'Je suis joignable:',
                formBtnValidateLabel: 'Demander de l\'aide',
                checkBoxOption: [
                  {label: 'via jabber', value: 'jabber'},
                  {label: 'via gsm', value: 'gsm'},
                  {label: 'via chat', value: 'chat'},
                  {label: 'via partage de session', value: 'session'}
                ]

              }
            },
            checkDoc: {
              accordionLabel: 'Consulter la documentation liée à cette page',
              accordionIcon: 'import_contacts'
            },
            faq: {
              accordionLabel: 'Questions fréquentes liées à cette page',
              accordionIcon: 'forum'
            },
            requestFeature: {
              accordionLabel: 'Proposer une amélioration',
              accordionIcon: 'highlight'
            },
            postBug: {
              accordionLabel: 'Rapporter un problème',
              accordionIcon: 'report'
            }
          }
        }
      },
      notify: {
        usersThatNeedHelp: {
          messageSingulier: ' collègue a besoin d\'aide',
          messagePluriel: ' collègues ont besoin d\'aide',
          icon: 'notifications_active'
        }
      },
      sticky: {
        iNeedHelp: {
          cancelButtonLabel: 'Annuler ma demande d\'aide',
          cancelButtonIcon: 'delete'
        }
      },
      modal: {
        modalUserConnection: {
          title: 'Auto-login ;-)',
          placeholder: 'qui es-tu ?'
        },
        modalRatingHelp: {
          title: 'Evaluation de l\'aide'
        }
      },
      actionSheet: {
        promptPreviousSessions: {
          title: 'Continuer la session précédente ?'
        }
      },
      other: {
        promptUserDevice: {
          text: 'C\'est la première fois que tu te connectes depuis cet appareil? Donne-lui un nom pour mieux gérer tes reprises de session:',
          name: {
            placeholder: '...nom de l\'appareil'
          },
          btn: {
            label: 'Enregistrer'
          }
        },
        promptSessionShared: {
          text: 'Cette page est partagée avec ',
          bgColor: 'bg-purple text-white', // bg-orange
          btn: {
            label: 'Quitter le partage'
          }
        }
      }
    },
    helpModule: {
      notify: {
        userHelpedIsAlreadyBeingHelped: {
          message: ` vient juste d'être pris en charge par un autre collègue. Merci quand même !`,
          icon: 'thumb_up',
          color: 'positive'
        },
        userHelpedDoesNotNeedHelpAnymore: {
          message: ` n'a plus besoin d'aide. Merci quand même !`,
          icon: 'thumb_up',
          color: 'positive'
        },
        helpStoppedByUser: {
          message: `Merci pour ton aide ! N'hésite pas à contribuer à la documentation si tu l'estimes nécessaire !`,
          icon: 'thumb_up',
          color: 'positive'
        },
        userHelpedContributed: {
          message: `Merci pour ta contribution !`,
          icon: 'thumb_up',
          color: 'positive'
        }
      }
    }
  }
}
