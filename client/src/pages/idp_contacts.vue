<template>
  <q-page padding>
    <!-- content -->
    <q-field
      label="Prénom"
      helper="Ton prénom"
    >
      <q-input v-model="newContact.firstName" @input="setContactStateFormValues" />
    </q-field>
    <q-field
      label="Nom"
      helper="Ton nom"
    >
      <q-input v-model="newContact.lastName" @input="setContactStateFormValues" />
    </q-field>
    <q-field
      label="Login RTBF"
      helper="Ton login RTBF"
      error-label="Ce login existe déjà dans notre base de données"
      :count="6"
    >
      <q-input suffix="@rtbf.be" v-model="newContact.rtbfLogin" @input="setContactStateFormValues" />
    </q-field>
    <q-btn color="primary" @click="createContact">Créer un nouveau contact</q-btn>
    <q-table
      :data="contacts"
      :columns="columns"
      :filter="filter"
      :visible-columns="visibleColumns"
      :separator="separator"
      row-key="name"
      color="secondary"
    >
      <template slot="top-left" slot-scope="props">
        <q-search
          hide-underline
          color="secondary"
          v-model="filter"
          class="col-6"
        />
      </template>
      <template slot="top-right" slot-scope="props">
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  created () {
    this.getContacts()
  },
  mounted () {
    this.saveUserLog({})
    // A chaque fois que j'arrive sur cette "page contact", je pré-remplis le formulaire avec les valeurs déjà entrées (s'il y en avait). Sinon, quand je change de page et que je reviens, les champs du formulaire sont vides
    this.getContactStateFormValues()
  },
  data () {
    return {
      // Cette variable me sert au v-model du formulaire de création de nouveaux contacts. Son contenu sera populé au chargement de la page par les valeurs (s'il y en a) du state, et inversément il sera muté dans le state lorsque l'utilisateur encodera des valeurs dans le formulaire
      newContact: {},
      columns: [
        {
          name: 'rtbfLogin',
          required: true,
          label: 'Login',
          align: 'left',
          field: 'rtbfLogin',
          sortable: true
        },
        { name: 'firstName', label: 'Prénom', align: 'left', field: 'firstName', sortable: true },
        { name: 'lastName', label: 'Nom', align: 'left', field: 'lastName', sortable: true }
      ],
      filter: '',
      visibleColumns: ['rtbfLogin', 'firstName', 'lastName'],
      separator: 'horizontal',
      loading: true
    }
  },
  computed: {
    ...mapState(
      'globalModule',
      [
        'userConnected'
      ]
    ),
    ...mapState(
      'contactModule',
      [
        'contacts',
        'formNewContact'
      ]
    )
  },
  methods: {
    ...mapMutations(
      'contactModule',
      [
        'newContactSaveFormValues',
        'addContactToTempMemory'
      ]
    ),
    ...mapActions(
      'userModule',
      [
        'saveUserLog'
      ]
    ),
    getContacts () {
      console.log('idp_contacts.vue/getContacts')
      this.$socket.emit('getContacts')
    },
    // Méthode appelée au chargement de la page pour récupérer les valeurs du formulaire de création de contact (s'il y en a) depuis le state
    getContactStateFormValues: function () {
      console.log('idp_contacts.vue/getContactStateFormValues')
      // console.log(this.newContact)
      // console.log(this.formNewContact)
      // Object.assign(this.newContact, this.formNewContact)
      this.newContact = JSON.parse(JSON.stringify(this.formNewContact))
    },
    // Méthode qui sert à "persister dans le state" les valeurs encodées par l'utilisateur dans le formulaire de création de contact
    setContactStateFormValues: function (newContact) {
      console.log('idp_contacts.vue/setContactStateFormValues:')
      this.newContactSaveFormValues(this.newContact)
    },
    createContact () {
      console.log('idp_contacts.vue/createContact')
      // this.createContact(JSON.parse(JSON.stringify(this.newContact)))
      this.newContact.createdBy = this.userConnected._id
      // J'enregistre dans un state les valeurs encodées par l'utilisateur jusqu'à ce que j'aie la confirmation que l'insertion en DB est OK
      this.addContactToTempMemory(this.newContact)
      this.$socket.emit('createContact', this.newContact)
      this.saveUserLog({frontendAction: 'createContact', backendAction: 'createContact', payloadToServer: this.newContact}) // J'enregistre une trace dans les logs
      this.newContact = {} // Je nettoie les valeurs dans les champs (via la mécanique de binding v_model)
      this.newContactSaveFormValues({}) // Je nettoie ces mêmes valeurs dans le state
    }
  }
}
</script>

<style>
</style>
