<template>
  <q-page>
    <!-- content -->
    <q-tabs align="center">
      <q-route-tab
        default
        slot="title"
        icon=""
        to="/idp/monitoring/workflows"
        label="BC workflows"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/monitoring/openMedia"
        label="Conduites OpenMedia"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/monitoring/jobs"
        label="Jobs"
      />
      <q-route-tab
        slot="title"
        icon=""
        to="/idp/monitoring/platform"
        label="Plateforme"
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
