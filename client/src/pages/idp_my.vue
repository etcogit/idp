<template>
  <q-page>
    <q-tabs align="center">
      <q-route-tab
        default
        slot="title"
        icon=""
        to="/idp/my/planning"
        label="Mon planning"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/my/bcs"
        label="Mes BC's"
      />
      <q-route-tab
        count="5"
        slot="title"
        icon=""
        to="/idp/my/notifications"
        label="Mes notifications"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/my/bookmarks"
        label="Mes favoris"
      />
    </q-tabs>
    <!-- content -->
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
