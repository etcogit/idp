<template>
  <q-layout view="HHH LpR LfR"> <!--  hHh ppp fff Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-layout-header>
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
        <q-btn-dropdown
          color="purple"
          split
          label="X collègues ont besoin d'aide"
        >
          <!-- dropdown content -->
          <q-list link>
            <q-item>
              <q-item-main>
                <q-item-tile label>Je veux bien aider</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <q-item-tile label>Pas maintenant</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          dense
          flat
          :icon="$appConfig.idp_home.toolbar.help.icon"
        >
          <q-popover>

            <!--
            <q-list highlight separator link>
              <q-item
                v-for="user in ingests.users"
                :key="user.rtbfLogin"
                v-close-overlay
                highlight separator
                @click.native="connectUser(user)"
              >
                <q-item-main>
                  {{ user.firstName }} {{ user.lastName }} ({{ user.rtbfLogin }})
                </q-item-main>
              </q-item>
            </q-list>
            -->
            <q-item
              v-close-overlay
              highlight separator
              @click="helpNeededAction"
            >
              <q-item-main>
                <q-item-tile label>Demander de l'aide aux utilisateurs connectés</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item
              v-close-overlay
              highlight separator
            >
              <q-item-main>
                <q-item-tile label>Consulter la documentation liée à cette page</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item
              v-close-overlay
              highlight separator
            >
              <q-item-main>
                <q-item-tile label>Questions fréquentes liées à cette page</q-item-tile>
              </q-item-main>
            </q-item>
          </q-popover>
        </q-btn>
        <!-- ME -->
        <q-btn
          dense
          flat
          icon="account_box"
        >
          <q-popover>
            <q-item>
              <q-item-main>
                <q-item-tile label>{{ userConnected.firstName }} {{ userConnected.lastName }}</q-item-tile>
                <q-item-tile sublabel>{{ userConnected.rtbfLogin }}@rtbf.be</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item-separator />
            <q-item>
              <q-item-main>
                <q-btn v-close-overlay :no-wrap="true" icon="exit_to_app" label="Me déconnecter" @click.native="disconnectUserAction" />
              </q-item-main>
            </q-item>

            <!--
            <q-list highlight separator link>
              <q-item
                v-for="user in ingests.users"
                :key="user.rtbfLogin"
                v-close-overlay
                highlight separator
                @click.native="connectUser(user)"
              >
                <q-item-main>
                  {{ user.firstName }} {{ user.lastName }} ({{ user.rtbfLogin }})
                </q-item-main>
              </q-item>
            </q-list>
            -->
          </q-popover>
        </q-btn>
        <!-- CONNECTION STATUS -->
        <!-- <q-icon name="warning" color="negative" v-if="!socketConnected" /> -->
        <q-icon name="warning" color="negative" v-if="$socket.disconnected" />
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
      v-model="rightDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
    </q-layout-drawer>
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

    <!-- <q-modal v-if="!$store.isUserConnected" :content-css="{padding: '50px', minWidth: '50vw'}"> -->
    <q-modal
      v-model="isUserConnected"
      :content-css="{padding: '50px', minWidth: '50vw'}"
      :no-route-dismiss="true"
      :no-esc-dismiss="true"
      :no-backdrop-dismiss="true"
    >
      <div class="q-display-1 q-mb-md">{{ $appConfig.modalUserConnection.title }}</div>
      <q-search v-model="terms" autofocus="true" :placeholder="$appConfig.modalUserConnection.placeholder">
        <!--
        <q-autocomplete
          :static-data="{field: 'rtbfLogin', list: dbContacts.results}"
          @selected="connectUserAction"
          @hide="terms=''"
        />
        -->
        <q-autocomplete
          :debounce="500"
          @selected="connectUserAction"
          @hide="terms=''"
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
    <!--
    <q-action-sheet
      v-model="promptPreviousSessionsComputed"
      title="Action Sheet"
      @ok="onOk"
      @cancel="onCancel"
      @show="onShow"
      @hide="onHide"
    />
    -->
  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
// import appConfig from 'plugins/appConfig'

export default {
  created () {
    this.$axios.defaults.baseURL = this.$appConfig.restApiUrl // Je configure $axios avec les paramètres définis par défaut dans $appConfig
  },
  mounted () {
    this.saveLogAction({})
  },
  data () {
    return {
      // promptPreviousSessions: true,
      leftDrawerOpen: true,
      popoverOpen: false,
      terms: ''
    }
  },
  computed: {
    ...mapState(
      'globalModule',
      [
        'socketConnected',
        'userConnected',
        'promptPreviousSessions'
      ]
    ),
    /*
    ...mapState(
      'contactModule',
      [
        'contacts'
      ]
    ),
    */
    ...mapState(
      'dbModule',
      [
        'dbContacts'
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
    loginAutocompleteSearch (terms, done) {
      console.log('idp_home.vue/search: ' + terms)
      // make an AJAX call
      // then call done(Array results)
      // Je construis ma requête
      let query = {
        conditions: {
          $or: [
            {rtbfLogin: {$regex: terms, $options: 'i'}},
            {firstName: {$regex: terms, $options: 'i'}},
            {lastName: {$regex: terms, $options: 'i'}}
          ]
        },
        fields: 'rtbfLogin firstName lastName',
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
              label: response.data[i].firstName + ' ' + response.data[i].lastName,
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
        'promptPreviousSessionsMutation'
      ]
    ),
    ...mapMutations(
      'dbModule',
      [
        'keepDbContactsMutation',
        'keepDbLogsMutation',
        'keepDbUsersForAutocompleteMutation'
      ]
    ),
    ...mapActions(
      'globalModule',
      [
        'saveLogAction',
        'connectUserAction',
        'disconnectUserAction'
      ]
    ),
    ...mapActions(
      'dbModule',
      [
        'keepDbLogsAction',
        'getContactsAction',
        'loadSessionAction'
      ]
    )
  },
  // Je définis ce qu'il faut faire quand je reçois des socket-messages du serveur
  sockets: {
    // Quand j'obtiens une connexion socket avec le serveur
    connect: function () {
      console.log('idp_home.vue/connect')
      // Je modifie une variable de mon state pour pouvoir afficher mon statut de connexion
      this.$store.commit('globalModule/socketConnect', true)
    },
    // Quand je perds la connexion socket avec le serveur
    disconnect: function () {
      console.log('idp_home.vue/disconnect')
      // Je modifie une variable de mon state pour pouvoir afficher mon statut de connexion
      this.$store.commit('globalModule/socketConnect', false)
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
      // Je dois mapper la liste dbContacts pour qu'elle corresponde aux critères de l'autocomplete
      if (this.dbContacts.results.length === 0) {
        for (var i = 0; i < contacts.length; i++) {
          this.keepDbUsersForAutocompleteMutation(contacts[i])
        }
      }
    },
    // Quand un userLog est enregistré dans la DB, je nettoie mon state temporaire
    socketLogSaved (userLog) {
      console.log('idp_home.vue/socketLogSaved: ') //  + JSON.stringify(userLog)
      this.keepDbLogsMutation(userLog)
      this.deleteLogOfTempMemoryMutation(userLog)
    },
    // Quand le serveur m'envoie la liste des logs
    socketLogsList (data) {
      console.log('idp_home.vue/socketLogsList')
      // Je sauvegarde la liste des logs
      this.keepDbLogsAction(data)
    }
  }
}
</script>

<style>
</style>
