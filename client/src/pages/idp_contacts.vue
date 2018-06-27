<template>
  <q-page padding>
    <!-- content -->
    <q-field
      label="Prénom"
      helper="Ton prénom"
    >
      <q-input v-model="formContactFirstName" />
    </q-field>
    <q-field
      label="Nom"
      helper="Ton nom"
    >
      <q-input v-model="formContactLastName" />
    </q-field>
    <q-field
      label="Login RTBF"
      helper="Ton login RTBF"
      error-label="Ce login existe déjà dans notre base de données"
      :count="6"
    >
      <q-input suffix="@rtbf.be" v-model="formContactRtbfLogin" />
    </q-field>
    <q-btn color="primary" @click="createContactAction">Créer un nouveau contact</q-btn>
    <!--
    <q-field
      label="Prénom"
      helper="Ton prénom"
    >
      <q-input v-model="newContact.firstName" @input="newContactSaveFormValuesMutation(newContact)" />
    </q-field>
    <q-field
      label="Nom"
      helper="Ton nom"
    >
      <q-input v-model="newContact.lastName" @input="newContactSaveFormValuesMutation(newContact)" />
    </q-field>
    <q-field
      label="Login RTBF"
      helper="Ton login RTBF"
      error-label="Ce login existe déjà dans notre base de données"
      :count="6"
    >
      <q-input suffix="@rtbf.be" v-model="newContact.rtbfLogin" @input="newContactSaveFormValuesMutation(newContact)" />
    </q-field>
    <q-btn color="primary" @click="createContactAction(newContact); newContact = {}">Créer un nouveau contact</q-btn>
    -->
    <q-table
      dense
      :data="dbContacts"
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
    this.getContactsAction()
  },
  mounted () {
    this.saveLogAction({})
    // A chaque fois que j'arrive sur cette "page contact", je pré-remplis le formulaire avec les valeurs déjà entrées (s'il y en avait). Sinon, quand je change de page et que je reviens, les champs du formulaire sont vides
    // this.getContactStateFormValues()
  },
  data () {
    return {
      // Cette variable me sert au v-model du formulaire de création de nouveaux contacts. Son contenu sera populé au chargement de la page par les valeurs (s'il y en a) du state, et inversément il sera muté dans le state lorsque l'utilisateur encodera des valeurs dans le formulaire
      // newContact: {},
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
      'contactModule',
      [
        'formContact'
      ]
    ),
    ...mapState(
      'dbModule',
      [
        'dbContacts'
      ]
    ),
    formContactFirstName: {
      get () {
        return this.formContact.firstName
      },
      set (value) {
        this.formContactMutation({field: 'firstName', value: value})
      }
    },
    formContactLastName: {
      get () {
        return this.formContact.lastName
      },
      set (value) {
        this.formContactMutation({field: 'lastName', value: value})
      }
    },
    formContactRtbfLogin: {
      get () {
        return this.formContact.rtbfLogin
      },
      set (value) {
        this.formContactMutation({field: 'rtbfLogin', value: value})
      }
    }
  },
  methods: {
    ...mapMutations(
      'contactModule',
      [
        'formContactMutation'
      ]
    ),
    ...mapActions(
      'contactModule',
      [
        'createContactAction',
        'getContactsAction'
      ]
    ),
    ...mapActions(
      'globalModule',
      [
        'saveLogAction'
      ]
    )
    /*
    ,
    // Méthode appelée au chargement de la page pour récupérer les valeurs du formulaire de création de contact (s'il y en a) depuis le state
    getContactStateFormValues: function () {
      console.log('idp_contacts.vue/getContactStateFormValues')
      // Object.assign(this.newContact, this.formContact)
      this.newContact = JSON.parse(JSON.stringify(this.formContact))
    }
    */
  }
}
</script>

<style>
</style>
