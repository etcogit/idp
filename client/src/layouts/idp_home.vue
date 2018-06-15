<template>
  <q-layout view="HHH LpR LfR"> <!--  hHh ppp fff Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-layout-header>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          IntraProd
          <span slot="subtitle">NUMPROD everywhere</span>
        </q-toolbar-title>
        <!--
        <div>Uploading: {{totalRunningUploads}}</div>
        <div>&nbsp;-&nbsp;Ingesting: {{totalRunningIngests}}</div>
        <div>&nbsp;-&nbsp;Succeeded: {{totalSucceededIngests}}</div>
        -->
        <!--
        <q-btn color="secondary">
          <q-icon name="directions" />
          <q-popover v-model="popover">
            <div>tototititututata</div>
          </q-popover>
        </q-btn>
        -->
        <q-btn
          dense
          flat
          icon="account_box"
        >
          <!--
          <q-popover>
            <q-item>
              <q-item-main>
                Connected User:<br /> {{ ingests.user.firstName }} {{ ingests.user.lastName }} ({{ ingests.user.rtbfLogin }})
              </q-item-main>
            </q-item>
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
          </q-popover>
          -->
        </q-btn>
        <q-icon name="warning" color="negative" v-if="!socketConnected" />
      </q-toolbar>
    </q-layout-header>

    <!-- (Optional) The Footer -->
    <q-layout-footer>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          Intraprod
          <span slot="subtitle">NUMPROD everywhere</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-footer>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-layout-drawer
      side="left"
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
      >
        <q-list-header>Outils</q-list-header>
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

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

    <q-modal v-model="!isUserConnected" :content-css="{padding: '50px', minWidth: '50vw'}">
      <div class="q-display-1 q-mb-md">Basic Modal</div>
      <p>Scroll down to close</p>
      <!-- <q-btn color="primary" @click="userConnected = false" label="Close" /> -->
    </q-modal>

  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  mounted () {
    // this.saveUserLog({})
  },
  data () {
    return {
      leftDrawerOpen: true,
      popoverOpen: false
    }
  },
  computed: {
    ...mapState(
      'globalModule',
      [
        'socketConnected',
        'userConnected'
      ]
    ),
    ...mapGetters(
      'globalModule', ['isUserConnected']
    )
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
    ...mapMutations(
      'contactModule',
      [
        'getContacts',
        'addContactToList',
        'deleteContactOfTempMemory'
      ]
    ),
    ...mapMutations(
      'userModule',
      [
        'getUserLogs',
        'addUserLogToList',
        'deleteUserLogOfTempMemory'
      ]
    ),
    ...mapActions(
      'userModule',
      [
        'saveUserLog'
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
      this.addContactToList(newContact)
      this.deleteContactOfTempMemory(newContact)
      this.$q.notify({
        message: newContact.firstName + ' ' + newContact.lastName + ' (' + newContact.rtbfLogin + ') vient d\'être ajouté',
        type: 'positive'
      })
    },
    // Quand le serveur m'envoie la liste des contacts
    socketContactList (contacts) {
      this.getContacts(contacts)
    },
    // Quand un userLog est enregistré dans la DB, je nettoie mon state temporaire
    socketUserLogSaved (userLog) {
      console.log('idp_home.vue/socketUserLogSaved: ' + JSON.stringify(userLog))
      this.addUserLogToList(userLog)
      this.deleteUserLogOfTempMemory(userLog)
    }
  }
}
</script>

<style>
</style>
