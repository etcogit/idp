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
        <div>Uploading: {{totalRunningUploads}}</div>
        <div>&nbsp;-&nbsp;Ingesting: {{totalRunningIngests}}</div>
        <div>&nbsp;-&nbsp;Succeeded: {{totalSucceededIngests}}</div>
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
            <!--
            <q-list link separator class="scroll" style="min-width: 100px">
              <q-item
                v-for="n in 20"
                :key="`a-${n}`"
                v-close-overlay
                @click.native="notify"
              >
                <q-item-main label="Label" sublabel="Click me" />
              </q-item>
            </q-list>
            <q-list link style="min-width: 100px">
              <q-item
                v-for="user in ingests.users"
                v-close-overlay
                @click.native="notify"
              >
                {{ user.rtbfLogin }}
              </q-item>
            </q-list>
            -->
          </q-popover>
        </q-btn>
        <q-icon name="warning" color="negative" v-if="!ingests.socketConnection.imConnected" />
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

  </q-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  created () {
    if (this.$socket.connected) { // Une fois que le coeur de l'appli est chargé, je vérifie si j'ai bien la connection socket
      console.log('la connexion est établie')
      this.$store.commit('ingests/SOCKET_CONNECT', true)
    }
  },
  data () {
    return {
      leftDrawerOpen: true,
      popoverOpen: false
    }
  },
  computed: {
    ...mapState([]), // etco: j'importe tous les "states" de mes stores
    ...mapGetters([]), // etco: j'importe tous les "getters" de mes stores
    ingests () {
      return this.$store.state.ingests
    },
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
  },
  // Je définis ce qu'il faut faire quand je reçois des socket-messages du serveur
  sockets: {
    /*
    connect: function () { // ne fonctionne pas toujours au démarrage de l'appli... je ne sais pas pourquoi. Mais c'est pour ça que j'ai mis un palliatif dans "created"
      this.$store.commit('ingests/SOCKET_CONNECT', true)
      console.log('socket connected')
    },
    disconnect: function () {
      this.$store.commit('ingests/SOCKET_DISCONNECT', true)
      console.log('socket disconnected')
    }
    */
  },
  methods: {
    connectUser: function (user) {
      // console.log('Je connecte le user ' + user.rtbfLogin)
      this.$store.commit('ingests/connectUser', user)
    }
  }
}
</script>

<style>
</style>
