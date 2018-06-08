<template>
  <q-page padding>
    <!-- content -->
    <q-field
      label="Prénom"
      helper="Ton prénom"
    >
      <q-input v-model="newContact.firstName" />
    </q-field>
    <q-field
      label="Nom"
      helper="Ton nom"
    >
      <q-input v-model="newContact.lastName" />
    </q-field>
    <q-field
      label="Login RTBF"
      helper="Ton login RTBF"
      error-label="Ce login existe déjà dans notre base de données"
      :count="6"
    >
      <q-input suffix="@rtbf.be" v-model="newContact.rtbfLogin" />
    </q-field>
    <q-btn color="primary" @click="createContact">Créer un nouveau contact</q-btn>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  methods: {
    createContact: function (newContact) {
      console.log('createContact')
      this.$socket.emit('createContact', this.newContact)
    }
  },
  sockets: {
    toto: function (newContact) {
      console.log('toto contact created')
      console.log(newContact)
      // this.$socket.emit('createContact', this.newContact)
    },
    contactcreated: function (newContact) {
      console.log('contact created')
      console.log(newContact)
      // this.$socket.emit('createContact', this.newContact)
    }
  },
  data () {
    return {
      newContact: {
        firstName: '',
        lastName: '',
        rtbfLogin: ''
      }
    }
  }
}
</script>

<style>
</style>
