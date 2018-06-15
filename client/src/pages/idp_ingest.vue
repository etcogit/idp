<template>
  <q-page>
    <!-- content -->
    <q-tabs align="center">
      <q-route-tab
        default
        slot="title"
        icon=""
        to="/idp/ingest/bornes"
        label="Bornes"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/ingest/rec"
        label="Rec - flux"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/ingest/localFile"
        label="Fichiers locaux"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/ingest/ftp"
        label="FTP"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/ingest/webLink"
        label="Lien web"
      />
    </q-tabs>
    <!-- This is where pages get injected -->
    <router-view />
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  mounted () {
    this.saveUserLog({})
  },
  methods: {
    ...mapActions(
      'userModule',
      [
        'saveUserLog'
      ]
    )
  }
}
</script>

<style>
</style>
