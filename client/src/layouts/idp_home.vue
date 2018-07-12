<template>
  <q-layout view="HHH LpR LfR"> <!--  hHh ppp fff Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-layout-header>
      <div v-if="promptUserDeviceName" class="row gutter-sm text-white bg-teal-10 items-center content-center" style="padding-top: 10px">
        <div class="col-xs-12 col-sm-7" style="text-align:center; justify:center">{{ $appConfig.promptUserDevice.text }}</div>
        <div class="col-xs-1 col-sm-0"></div>
        <div class="col-xs-6 col-sm-2"><q-input class="col" style="padding: 0" :placeholder="$appConfig.promptUserDevice.name.placeholder" hide-underline align="center" color="teal-4" inverted v-model="userDeviceNameComputed" @keyup.enter="createUserDeviceCookieAction" /></div>
        <div class="col-xs-5 col-sm-2"><q-btn class="col" color="teal-4" :label="$appConfig.promptUserDevice.btn.label" @click="createUserDeviceCookieAction" /></div>
        <div class="col-xs-0 col-sm-1"></div>
      </div>
      <div v-if="helping" class="row gutter-sm bg-orange" style="text-align:center; padding: 5px">
        <div class="col-xs-12 col-sm-8">Cette page est partagée avec {{ iNeedHelp ? users.userHelping.fullName : users.userHelped.fullName }}</div>
        <div class="col-xs-12 col-sm-4"><q-btn dense outline label="Quitter le partage" @click="stopHelpingAction" /></div>
      </div>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          :icon="$appConfig.idp_home.toolbar.icon"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          {{ $appConfig.idp_home.toolbar.title }}
          <span slot="subtitle">{{ $appConfig.idp_home.toolbar.subtitle }}</span>
        </q-toolbar-title>
        <!--
        <div>Uploading: {{totalRunningUploads}}</div>
        <div>&nbsp;-&nbsp;Ingesting: {{totalRunningIngests}}</div>
        <div>&nbsp;-&nbsp;Succeeded: {{totalSucceededIngests}}</div>
        -->
        <!-- HELP -->
        <!-- Ce bouton change de couleur et se met à "pulser" si un autre utilisateur demande de l'aide -->
        <q-btn
          dense
          round
          :flat="!usersNeedHelp ? true : false"
          :icon="$appConfig.idp_home.toolbar.help.icon"
          :color="usersNeedHelp ? $appConfig.global.color.help.primaryColor : null"
          :text-color="usersNeedHelp ? $appConfig.global.color.help.textOnPrimaryColor : null"
          :class="usersNeedHelp ? 'animated infinite pulse' : null"
          @click.native="rightDrawerOpenMutation"
        />
        <!-- USER -->
        <q-btn
          dense
          flat
          :icon="$appConfig.idp_home.toolbar.user.icon"
        >
          <q-popover>
            <!-- ME -->
            <q-item>
              <q-item-main>
                <q-item-tile label>{{ userConnected.fullName }}</q-item-tile>
                <q-item-tile sublabel>{{ userConnected.rtbfLogin }}@rtbf.be</q-item-tile>
              </q-item-main>
              <q-item-side>
                <q-btn dense flat :icon="$appConfig.idp_home.toolbar.user.me.icon" v-close-overlay @click="disconnectUserAction">
                  <q-tooltip class="text-no-wrap">{{ $appConfig.idp_home.toolbar.user.me.tooltip }}</q-tooltip>
                </q-btn>
              </q-item-side>
            </q-item>
            <!-- DEVICE -->
            <q-item v-if="userDevice.hasOwnProperty('name')">
              <q-item-main>
                <q-item-tile label>{{ userDevice.name }}</q-item-tile>
                <q-item-tile sublabel><i>{{ $appConfig.idp_home.toolbar.user.device.sublabel }}</i></q-item-tile>
              </q-item-main>
              <q-item-side>
                <q-btn dense flat icon="create" color="grey-5" v-close-overlay @click="promptUserDeviceNameMutation" />
              </q-item-side>
            </q-item>
            <q-item-separator />
          </q-popover>
        </q-btn>
        <!-- CONNECTION STATUS -->
        <q-icon name="warning" color="negative" v-if="!socketConnected" />
        <!-- <q-icon name="warning" color="negative" v-if="$socket.disconnected" /> -->
      </q-toolbar>
    </q-layout-header>

    <!-- (Optional) The Footer -->
    <q-layout-footer>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          :icon="$appConfig.idp_home.toolbar.icon"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          {{ $appConfig.idp_home.toolbar.title }}
          <span slot="subtitle">{{ $appConfig.idp_home.toolbar.subtitle }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-footer>

    <!-- TIROIR DE GAUCHE -->
    <q-layout-drawer
      side="left"
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
      >
        <q-list-header>{{ $appConfig.idp_home.leftDrawer.listHeader }}</q-list-header>
        <q-item to="/idp" exact>
          <q-item-side icon="home" />
          <q-item-main label="Accueil" />
        </q-item>
        <q-item-separator />
        <q-item to="/idp/my">
          <q-item-side icon="favorite" />
          <q-item-main label="Mon Intraprod" />
        </q-item>
        <q-item to="/idp/ingest">
          <q-item-side icon="file_upload" />
          <q-item-main label="Ingest" />
        </q-item>
        <q-item to="/idp/bcs">
          <q-item-side icon="assignment" />
          <q-item-main label="Bons de commande" />
        </q-item>
        <q-item to="/idp/contacts">
          <q-item-side icon="people" />
          <q-item-main label="Contacts" />
        </q-item>
        <q-item-separator />
        <q-item to="/idp/monitoring">
          <q-item-side icon="show_chart" />
          <q-item-main label="Monitoring" />
        </q-item>
        <q-item to="/idp/settings">
          <q-item-side icon="settings" />
          <q-item-main label="Paramètres" />
        </q-item>
        <q-item to="/idp/help">
          <q-item-side icon="help_outline" />
          <q-item-main label="Aide" />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <!-- TIROIR DE DROITE -->
    <q-layout-drawer
      side="right"
      v-model="rightDrawerOpenComputed"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list separator>
        <q-collapsible
          v-if="usersNeedHelp"
          opened
          group="helpAccordion"
          :header-class="$appConfig.global.color.help.textPrimaryColor"
        >
          <template slot="header">
            <q-item-side left>
              <q-icon
                :name="$appConfig.idp_home.rightDrawer.help.accordion.userNeedHelp.accordionIcon"
                :color="$appConfig.global.color.help.primaryColor"
                size="24px"
              />
            </q-item-side>
            <q-item-main :label="$appConfig.idp_home.rightDrawer.help.accordion.userNeedHelp.accordionLabel" />
          </template>
          <q-list no-border>
            <q-item v-for="userThatNeedHelp in listUsersThatNeedHelp.results" :key="userThatNeedHelp.userId">
              <q-item-side left icon="account_circle" />
              <q-item-main>
                <div>{{ userThatNeedHelp.firstName + ' ' + userThatNeedHelp.lastName }}</div>
              </q-item-main>
              <q-item-side right>
                <q-btn label="Aider" dense outline :color="$appConfig.global.color.help.primaryColor" :disable="iNeedHelp" @click="iWillHelpAction(userThatNeedHelp)" />
              </q-item-side>
            </q-item>
          </q-list>
        </q-collapsible>
        <q-collapsible group="helpAccordion" :icon="$appConfig.idp_home.rightDrawer.help.accordion.iNeedHelp.accordionIcon" :label="$appConfig.idp_home.rightDrawer.help.accordion.iNeedHelp.accordionLabel">
          <div :class="$appConfig.global.color.help.textPrimaryColor">{{ $appConfig.idp_home.rightDrawer.help.accordion.iNeedHelp.waysToContactMe.formLabel }}</div>
          <q-option-group
            type="checkbox"
            :color="$appConfig.global.color.help.primaryColor"
            v-model="waysToContactMeComputed"
            :options="$appConfig.idp_home.rightDrawer.help.accordion.iNeedHelp.waysToContactMe.checkBoxOption"
          />
          <q-btn :label="$appConfig.idp_home.rightDrawer.help.accordion.iNeedHelp.waysToContactMe.formBtnValidateLabel" dense outline :color="$appConfig.global.color.help.primaryColor" :disable="iNeedHelp" @click="iNeedHelpAction" />
        </q-collapsible>
        <q-collapsible group="helpAccordion" :icon="$appConfig.idp_home.rightDrawer.help.accordion.checkDoc.accordionIcon" :label="$appConfig.idp_home.rightDrawer.help.accordion.checkDoc.accordionLabel">
          <div>
            Titi
          </div>
        </q-collapsible>
        <q-collapsible group="helpAccordion" :icon="$appConfig.idp_home.rightDrawer.help.accordion.faq.accordionIcon" :label="$appConfig.idp_home.rightDrawer.help.accordion.faq.accordionLabel">
          <div>
            Tata
          </div>
        </q-collapsible>
        <q-collapsible group="helpAccordion" :icon="$appConfig.idp_home.rightDrawer.help.accordion.requestFeature.accordionIcon" :label="$appConfig.idp_home.rightDrawer.help.accordion.requestFeature.accordionLabel">
          <div>
            Tata
          </div>
        </q-collapsible>
        <q-collapsible group="helpAccordion" :icon="$appConfig.idp_home.rightDrawer.help.accordion.postBug.accordionIcon" :label="$appConfig.idp_home.rightDrawer.help.accordion.postBug.accordionLabel">
          <div>
            Tata
          </div>
        </q-collapsible>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

    <!-- MODAL DE CONNECTION USER -->
    <q-modal
      v-model="promptUserConnection"
      :content-css="{padding: '50px', minWidth: '50vw'}"
      :no-route-dismiss="true"
      :no-esc-dismiss="true"
      :no-backdrop-dismiss="true"
    >
      <div class="q-display-1 q-mb-md">{{ $appConfig.modalUserConnection.title }}</div>
      <q-search v-model="userConnectAutoCompleteTextInput" autofocus="true" :placeholder="$appConfig.modalUserConnection.placeholder">
        <!--
        <q-autocomplete
          :static-data="{field: 'rtbfLogin', list: dbContacts.results}"
          @selected="connectUserAction"
          @hide="userConnectAutoCompleteTextInput=''"
        />
        -->
        <q-autocomplete
          :debounce="500"
          @selected="connectUserAction"
          @hide="userConnectAutoCompleteTextInput=''"
          @search="loginAutocompleteSearch"
        />
      </q-search>
    </q-modal>
    <!-- Cette action sheet affiche les dernières sessions de l'utilisateur quand il se connecte, lui proposant de poursuivre une session antérieure -->
    <q-action-sheet
      v-model="promptPreviousSessionsComputed"
      :title="$appConfig.promptPreviousSessions.title"
      :actions="promptPreviousSessions.sessionsList"
      @ok="loadSessionAction"
    />
    <!-- Bouton d'annulation de demande d'aide -->
    <!-- Cet élément doit rester le dernier avant la balise de fermeture q-layout -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn v-if="iNeedHelp" :color="$appConfig.global.color.help.primaryColor" :label="$appConfig.idp_home.sticky.iNeedHelp.cancelButtonLabel" @click="iNeedHelpCancelAction" :icon="$appConfig.idp_home.sticky.iNeedHelp.cancelButtonIcon" />
    </q-page-sticky>
  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
// import appConfig from 'plugins/appConfig'

export default {
  created () {
    this.$axios.defaults.baseURL = this.$appConfig.restApiUrl // Je configure $axios avec les paramètres définis par défaut dans $appConfig
    // J'effectue une requête socket pcq la connexion initiale se fait trop tôt
    this.$socket.emit('checkSocketConnexion')
    // J'affiche un "loading" en attendant que tout soit chargé
    if (this.socketConnected === false) {
      this.$q.loading.show({
        message: 'Chargement de l\'application...',
        messageColor: 'white',
        spinnerColor: 'white'
      })
    }
  },
  mounted () {
    this.saveLogAction({})
  },
  data () {
    return {
      leftDrawerOpen: true,
      userConnectAutoCompleteTextInput: ''
    }
  },
  computed: {
    ...mapState(
      'globalModule',
      [
        'socketConnected',
        'userConnected',
        'promptUserConnection',
        'promptPreviousSessions',
        'promptUserDeviceName',
        'rightDrawerOpen',
        'userDevice'
      ]
    ),
    ...mapState(
      'helpModule',
      [
        'waysToContactMe',
        'iNeedHelp',
        'usersNeedHelp',
        'helping',
        'userHelping'
      ]
    ),
    ...mapState(
      'dbModule',
      [
        // 'dbContacts'
        'listUsersThatNeedHelp'
      ]
    ),
    // ...mapGetters([])
    ...mapGetters(
      'globalModule', ['isUserConnected']
    ),
    promptPreviousSessionsComputed: {
      get () {
        return this.promptPreviousSessions.vmodel
      },
      set (value) {
        this.promptPreviousSessionsMutation({field: 'vmodel', value: value})
      }
    },
    rightDrawerOpenComputed: {
      get () {
        // console.log('rightDrawerOpen: ' + this.rightDrawerOpen)
        return this.rightDrawerOpen
      },
      set (value) {
        this.rightDrawerOpenMutation(value)
      }
    },
    waysToContactMeComputed: {
      get () {
        return this.waysToContactMe
      },
      set (value) {
        this.waysToContactMeMutation(value)
      }
    },
    userDeviceNameComputed: {
      get () {
        return this.userDevice.name
      },
      set (value) {
        this.userDeviceMutation({name: value})
      }
    }
    /*
    ingests () {
      return this.$store.state.ingests
    },
    */
    /*
    totalRunningUploads () {
      var totalRunningUploads = 0
      if (this.$store.state.ingests.ingests.currentIngest.files) {
        for (var i = 0; i < this.$store.state.ingests.ingests.currentIngest.files.length; i++) {
          if ([1, 2, 6].includes(this.$store.state.ingests.ingests.currentIngest.files[i].idp.ingestStatus.code)) {
            totalRunningUploads++
          }
        }
      }
      for (var j = 0; j < this.$store.state.ingests.ingests.runningIngests.length; j++) {
        for (var k = 0; k < this.$store.state.ingests.ingests.runningIngests[j].files.length; k++) {
          if ([1, 2, 6].includes(this.$store.state.ingests.ingests.runningIngests[j].files[k].idp.ingestStatus.code)) {
            totalRunningUploads++
          }
        }
      }
      return totalRunningUploads
    },
    totalRunningIngests () {
      var totalRunningIngests = 0
      for (var i = 0; i < this.$store.state.ingests.ingests.runningIngests.length; i++) {
        for (var j = 0; j < this.$store.state.ingests.ingests.runningIngests[i].files.length; j++) {
          if ([3, 4].includes(this.$store.state.ingests.ingests.runningIngests[i].files[j].idp.ingestStatus.code)) {
            totalRunningIngests++
          }
        }
      }
      return totalRunningIngests
    },
    totalSucceededIngests () {
      var totalSucceededIngests = 0
      for (var i = 0; i < this.$store.state.ingests.ingests.runningIngests.length; i++) {
        for (var j = 0; j < this.$store.state.ingests.ingests.runningIngests[i].files.length; j++) {
          if (this.$store.state.ingests.ingests.runningIngests[i].files[j].idp.ingestStatus.code === 5) {
            totalSucceededIngests++
          }
        }
      }
      for (var k = 0; k < this.$store.state.ingests.ingests.successIngests.length; k++) {
        for (var l = 0; l < this.$store.state.ingests.ingests.successIngests[k].files.length; l++) {
          if (this.$store.state.ingests.ingests.successIngests[k].files[l].idp.ingestStatus.code === 5) {
            totalSucceededIngests++
          }
        }
      }
      return totalSucceededIngests
    }
    */
  },
  methods: {
    loginAutocompleteSearch (userConnectAutoCompleteTextInput, done) {
      console.log('idp_home.vue/search: ' + userConnectAutoCompleteTextInput)
      // make an AJAX call
      // then call done(Array results)
      // Je construis ma requête
      let query = {
        conditions: {
          $or: [
            {rtbfLogin: {$regex: userConnectAutoCompleteTextInput, $options: 'i'}},
            {firstName: {$regex: userConnectAutoCompleteTextInput, $options: 'i'}},
            {lastName: {$regex: userConnectAutoCompleteTextInput, $options: 'i'}}
          ]
        },
        fields: 'rtbfLogin firstName lastName fullName',
        limit: 10
      }
      // console.log(query)
      // Je cherche la liste des contacts pour les charger dans la dropdown de connexion
      this.$axios.post('/getContacts', query)
        .then((response) => {
          let results = []
          for (var i = 0; i < response.data.length; i++) {
            results.push({
              // stringToSearchFor: data.firstName + ' ' + data.lastName + ' ' + data.rtbfLogin,
              // stringToSearchFor: response.data[i].rtbfLogin,
              value: response.data[i],
              // label: response.data[i].firstName + ' ' + response.data[i].lastName,
              label: response.data[i].fullName,
              sublabel: response.data[i].rtbfLogin + '@rtbf.be',
              icon: 'person'
            })
          }
          done(results)
          // console.log(results)
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
          done([])
        })
      // DO NOT forget to call done! When no results or an error occurred,
      // just call with empty array as param. Example: done([])
    },
    ...mapMutations(
      'contactModule',
      [
        // 'addContactToListMutation',
        'deleteContactOfTempMemoryMutation'
      ]
    ),
    ...mapMutations(
      'globalModule',
      [
        // 'addLogToListMutation',
        'deleteLogOfTempMemoryMutation',
        'promptPreviousSessionsMutation',
        'promptUserDeviceNameMutation',
        'rightDrawerOpenMutation',
        'userDeviceMutation'
      ]
    ),
    ...mapMutations(
      'dbModule',
      [
        'keepDbContactsMutation',
        'keepDbLogsMutation'
      ]
    ),
    ...mapMutations(
      'helpModule',
      [
        'waysToContactMeMutation'
      ]
    ),
    ...mapActions(
      'globalModule',
      [
        'saveLogAction',
        'connectUserAction',
        'connectUserIfCookieAction',
        'disconnectUserAction',
        'createUserDeviceCookieAction'
      ]
    ),
    ...mapActions(
      'dbModule',
      [
        'keepDbLogsAction',
        'loadSessionAction',
        'iWillHelpAction',
        'joinSocketRoomAction'
      ]
    ),
    ...mapActions(
      'helpModule',
      [
        'iNeedHelpAction',
        'iNeedHelpCancelAction',
        'keepUsersThatNeedHelpAction',
        'startHelpingAction',
        'stopHelpingAction'
      ]
    )
  },
  // Je définis ce qu'il faut faire quand je reçois des socket-messages du serveur
  sockets: {
    // Quand j'obtiens une connexion socket avec le serveur
    connect: function () {
      console.log('idp_home.vue/connect')
      /*
      // Je modifie une variable de mon state pour pouvoir afficher mon statut de connexion
      this.$store.commit('globalModule/socketConnect', true)
      // S'il n'y a pas de user connecté, je regarde s'il y a un cookie userConnected pour le connecter automatiquement
      if (!this.userConnected.hasOwnProperty('_id')) {
        this.connectUserIfCookieAction()
      }
      */
    },
    // Quand je perds la connexion socket avec le serveur
    disconnect: function () {
      console.log('idp_home.vue/disconnect')
      // Je modifie une variable de mon state pour pouvoir afficher mon statut de connexion
      this.$store.commit('globalModule/socketConnect', false)
    },
    // Quand j'ai la confirmation de connection socket, je lance qques processus
    socketConnectionEstablished (status) {
      console.log('idp_home.vue/socketConnectionEstablished')
      // Je modifie une variable de mon state pour pouvoir afficher mon statut de connexion
      this.$store.commit('globalModule/socketConnect', true)
      // S'il n'y a pas de user connecté, je regarde s'il y a un cookie userConnected pour le connecter automatiquement
      if (!this.userConnected.hasOwnProperty('_id')) {
        this.connectUserIfCookieAction()
      }
    },
    // Quand un contact est créé, je notifie l'utilisateur, je rajoute le contact à la liste locale et je nettoie mon state temporaire
    socketContactCreated (newContact) {
      console.log('idp_home.vue/socketContactCreated')
      // this.addContactToListMutation(newContact)
      this.keepDbContactsMutation(newContact)
      this.deleteContactOfTempMemoryMutation(newContact)
      this.$q.notify({
        message: newContact.firstName + ' ' + newContact.lastName + ' (' + newContact.rtbfLogin + ') vient d\'être ajouté',
        type: 'positive'
      })
    },
    // Quand le serveur m'envoie la liste des contacts
    socketContactList (contacts) {
      console.log('idp_home.vue/socketContactList')
      // Je sauvegarde la liste des contacts
      this.keepDbContactsMutation(contacts)
    },
    // Quand un userLog est enregistré dans la DB, je nettoie mon state temporaire
    socketLogSaved (userLog) {
      if (this.$appConfig.global.console.logs === true) {
        console.log('idp_home.vue/socketLogSaved: ') //  + JSON.stringify(userLog)
      }
      this.keepDbLogsMutation(userLog)
      this.deleteLogOfTempMemoryMutation(userLog)
    },
    // Quand le serveur m'envoie la liste des logs
    socketLogsList (data) {
      console.log('idp_home.vue/socketLogsList')
      // Je sauvegarde la liste des logs
      this.keepDbLogsAction(data)
    },
    // Quand le serveur m'envoie la liste des users qui demandent de l'aide
    usersThatNeedHelpList (data) {
      console.log('idp_home.vue/usersThatNeedHelpList')
      // Je sauvegarde la liste
      this.keepUsersThatNeedHelpAction(data)
    },
    // Je dois rejoindre la room créée pour interagir avec un autre user
    socketJoinRoom (data) {
      console.log('idp_home.vue/socketJoinRoom')
      console.log(data)
      // Je m'inscris à la room
      this.joinSocketRoomAction(data)
    },
    // Je reçois le rootState de l'aidé
    socketStartHelping (data) {
      console.log('idp_home.vue/socketStartHelping')
      console.log(data)
      // console.log(data)
      // console.log(this.$socket)
      this.startHelpingAction(data)
    }
  }
}
</script>

<style>
</style>
