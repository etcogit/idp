<template>
<div class="example-full">
  <!-- etco: Le composant d'upload est copié de https://lian-yue.github.io/vue-upload-component -->

  <!-- etco: Cette div sert à "noircir" la page quand on Drag un fichier dans la page. Le texte ne s'affiche que quand on drag un fichier sur la page -->
  <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
    <h3>Dépose tes fichiers</h3>
  </div>

  <div>tutu {{ myDataModel }}</div><q-input v-model="myDataModel" placeholder="Add some text..." /><q-btn round color="secondary" icon="card_giftcard" @click="myIngestMethod(myDataModel)" />

  <div class="row justify-center">
    <!-- Tableau des "currentIngests" -->
    <q-table
      :data="files"
      :columns="columns"
      selection="multiple"
      :selected.sync="ingests.currentIngest.files"
      row-key="id"
      color="secondary"
      title="Selectionne les fichiers à ingester"
      v-if="files.length > 0"
      :pagination.sync="pagination"
    >
      <!--
      <q-tr slot="top-row" slot-scope="props">
        <q-td colspan="100%">
          <strong>Extra top row</strong>
        </q-td>
      </q-tr>
      -->
      <!-- gets displayed only when there's at least one row selected -->
      <template slot="top-selection" slot-scope="props">
        <q-btn color="secondary" flat label="Action 1" class="q-mr-sm" />
        <q-btn color="secondary" flat label="Action 2" />
        <div class="col" />
        <q-btn color="negative" flat round delete icon="delete" @click="startGlobalIngest" />
      </template>
      <template slot="body" slot-scope="props">
        <q-tr :props="props" @click.native="props.expand = !props.expand" class="cursor-pointer">
          <q-td auto-width>
            <q-checkbox color="primary" v-model="props.selected" />
          </q-td>
          <q-td key="thumb" :props="props">
            <!-- <q-btn color="negative" flat round delete icon="delete" @click.prevent="$refs.upload.remove(props.row);props.selected.remove(props.row)" /> -->
            <img v-if="props.row.thumb" :src="props.row.thumb" style="min-width:auto; max-height: 2em; border-style:none" />
            <q-icon v-else name="insert_drive_file" color="#737373" size="2em" />
            <!-- {{ props.row.icon }} -->
          </q-td>
          <q-td key="name" :props="props">
            <q-checkbox color="primary" v-model="props.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" />
            <!-- <input type="text" v-model="props.row.name" /> -->
            {{ props.row.name }}
            <q-progress :percentage="props.row.idp.uploadPercentage" :color="props.row.success ? 'positive' : 'secondary'" stripe />
          </q-td>
          <q-td key="fileSize" :props="props">{{ props.row.idp.fileSize }}</q-td>
          <q-td key="killDate" :props="props">{{ props.row.idp.killDate }}</q-td>
          <q-td key="ingestStatus" :props="props">
            <q-icon :name="props.row.idp.ingestStatus.icon" :color="props.row.idp.ingestStatus.color" size="2em" />
            <!-- {{ props.row.idp.ingestStatus.label }} -->
          </q-td>
          <q-td key="actionBtns" :props="props">
            <q-btn color="negative" flat round delete icon="delete" @click="deleteRow(props.row)" />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Grille des "runningIngests" -->
    <q-table
      v-for="ingest in ingests.runningIngests"
      :key="ingest.ingestId"
      :data="ingest.files"
      :columns="columnsRunningIngests"
      row-key="id"
      color="secondary"
      :title="'Ingest ID: ' + ingest.ingestId"
      v-if="ingests.runningIngests.length > 0"
      :pagination.sync="pagination"
    >
      <template slot="body" slot-scope="props">
        <q-tr :props="props" @click.native="props.expand = !props.expand" class="cursor-pointer">
          <q-td key="thumb" :props="props">
            <img v-if="props.row.thumb" :src="props.row.thumb" style="min-width:auto; max-height: 2em; border-style:none" />
            <q-icon v-else name="insert_drive_file" color="#737373" size="2em" />
          </q-td>
          <q-td key="name" :props="props">
            <q-checkbox color="primary" v-model="props.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" />
            {{ props.row.name }}
            <q-progress :percentage="props.row.idp.uploadPercentage" :color="props.row.success ? 'positive' : 'secondary'" stripe />
          </q-td>
          <q-td key="fileSize" :props="props">{{ props.row.idp.fileSize }}</q-td>
          <q-td key="killDate" :props="props">{{ props.row.idp.killDate }}</q-td>
          <q-td key="ingestStatus" :props="props">
            <q-icon :name="props.row.idp.ingestStatus.icon" :color="props.row.idp.ingestStatus.color" size="2em" />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Grille des "successIngests" -->
    <q-table
      v-for="ingest in ingests.successIngests"
      :key="ingest.ingestId"
      :data="ingest.files"
      :columns="columnsRunningIngests"
      row-key="id"
      color="secondary"
      :title="'Ingest ID: ' + ingest.ingestId"
      v-if="ingests.successIngests.length > 0"
      :pagination.sync="pagination"
    >
      <template slot="body" slot-scope="props">
        <q-tr :props="props" @click.native="props.expand = !props.expand" class="cursor-pointer">
          <q-td key="thumb" :props="props">
            <img v-if="props.row.thumb" :src="props.row.thumb" style="min-width:auto; max-height: 2em; border-style:none" />
            <q-icon v-else name="insert_drive_file" color="#737373" size="2em" />
          </q-td>
          <q-td key="name" :props="props">
            <q-checkbox color="primary" v-model="props.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" />
            {{ props.row.name }}
            <q-progress :percentage="props.row.idp.uploadPercentage" :color="props.row.success ? 'positive' : 'secondary'" stripe />
          </q-td>
          <q-td key="fileSize" :props="props">{{ props.row.idp.fileSize }}</q-td>
          <q-td key="killDate" :props="props">{{ props.row.idp.killDate }}</q-td>
          <q-td key="ingestStatus" :props="props">
            <q-icon :name="props.row.idp.ingestStatus.icon" :color="props.row.idp.ingestStatus.color" size="2em" />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div class="text-center p-5">
    <h4 v-if="!$q.platform.has.touch">Dépose des fichiers ou dossiers ici<br/>ou</h4>
    <file-upload
      class="btn btn-primary dropdown-toggle"
      :extensions="extensions"
      :accept="accept"
      :multiple="multiple"
      :directory=false
      :add-index="addIndex"
      v-model="files"
      @input-filter="inputFilter"
      @input-file="inputFile"
      ref="upload">
      <i class="fa fa-plus"></i>
      Ajoute des fichiers
    </file-upload>
    <file-upload
      class="btn btn-primary dropdown-toggle"
      :extensions="extensions"
      :accept="accept"
      :multiple="multiple"
      :directory=true
      :drop="drop"
      :drop-directory="dropDirectory"
      :add-index="addIndex"
      v-model="files"
      v-if="!$q.platform.has.touch"
      @input-filter="inputFilter"
      @input-file="inputFile"
      ref="upload">
      <i class="fa fa-plus"></i>
      Ajoute un dossier
    </file-upload>
  </div>
</div>
</template>
<style>
.etco-asset {
  display: flex;
  /* box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12); */
}
.q-item-image {
  min-width: auto;
  max-width: 114px;
  min-height: auto;
  max-height: 114px;
}
.q-table-container {
  width: 100%;
}
.example-full .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}
.example-full .drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
.assetCard {
  max-width: 350px;
}
</style>

<script>
// import Cropper from 'cropperjs'
// import ImageCompressor from '@xkeshi/image-compressor'
import FileUpload from 'vue-upload-component'
// import VueJsonPretty from 'vue-json-pretty'

import { format, date } from 'quasar' // etco: j'importe un "utils Quasar" dans la variable "format"
const { humanStorageSize } = format // etco: Je récupère la méthode "humanStorageSize" dans les "utils" de Quasar stockés dans "format" lors de l'import
const { addToDate, formatDate } = date
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    FileUpload
  },
  computed: {
    ...mapState([]), // etco: j'importe tous les "states" de mes stores
    ...mapGetters([]), // etco: j'importe tous les "getters" de mes stores
    killDateInTenDays () {
      let myDate = addToDate(new Date(), { days: 10 })
      myDate = formatDate(myDate, 'D MMMM YYYY', {
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      })
      return myDate
    }
  },
  data () {
    return {
      myDataModel: 'myDataModel',
      ingestStatus: [
        {code: 0, label: 'none', icon: '', color: ''},
        {code: 1, label: 'Waiting for upload', icon: 'access_time', color: 'info'},
        {code: 2, label: 'Uploading', icon: 'airplay', color: 'warning'},
        {code: 3, label: 'Uploaded -> waiting for ingest', icon: 'timelapse', color: 'info'},
        {code: 4, label: 'Ingest started', icon: 'queue_play_next', color: 'warning'},
        {code: 5, label: 'Ingested', icon: 'done', color: 'positive'},
        {code: 6, label: 'Upload paused', icon: 'pause_circle_outline', color: 'light'},
        {code: 7, label: 'Upload error', icon: 'error_outline', color: 'negative'},
        {code: 8, label: 'Ingest error', icon: 'error', color: 'negative'}
      ],
      /* UPLOAD */
      files: [],
      accept: 'image/png,image/gif,image/jpeg,image/webp',
      extensions: 'gif,jpg,jpeg,png,webp',
      // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
      // extensions: /\.(gif|jpe?g|png|webp)$/i,
      multiple: true,
      // directory: false,
      drop: true,
      dropDirectory: true,
      addIndex: false,
      // name: 'file',
      // uploadAuto: false,

      // etco: propriétés de tous les ingests
      ingests: {
        emptyPattern: {
          ingestId: '',
          ingestGlobalPatternName: [],
          ingestGlobalKillDate: 0,
          ingestGlobalKillDateHuman: '',
          ingestTotalSize: 0,
          ingestTotalSizeHuman: 0,
          ingestUploadedSize: 0,
          ingestUploadedSizeHuman: 0,
          ingestProdId: '',
          files: [],
          ingestCreationDate: 0,
          ingestCreationDateHuman: '',
          ingestCreator: '',
          ingestStartDate: 0,
          ingestStartDateHuman: '',
          ingestUploadStatus: 'stopped',
          ingestUploadFinishedDate: 0,
          ingestUploadFinishedDateHuman: '',
          ingestVpmsReadyDate: 0,
          ingestVpmsReadyDateHuman: '',
          ingestGlobalWorkflows: {
            onGlobalUploadStarted: {},
            onGlobalUploadFinished: {},
            onGlobalStarted: {},
            onGlobalVpmsReady: {}
          },
          ingestGlobalPayload: {}
        },
        currentIngest: {},
        runningIngests: [],
        successIngests: [],
        errorIngests: [],
        running: [],
        success: [],
        error: []
      },

      // etco: toutes les prods
      prods: {
        emptyPattern: {
          prodId: '',
          prodName: '',
          prodIdPath: '',
          prodNamePath: '',
          prodCreator: '',
          prodTeam: [],
          prodParentTeam: [],
          prodSharedWith: [],
          serieTeam: [],
          prodKillDate: 0,
          prodKillDateHuman: '',
          serie: ''
        },
        listProds: { // l'idée est de mettre le prodId comme clé de l'objet et tout l'objet comme objet ;-) -> listProds: {QALU20180527000001: {toutes les propriétés de mon objet}}
          QALU20180509000001: {
            prodId: 'QALU20180509000001',
            prodName: 'VueJS',
            prodIdPath: '18-TMTZA100001-PR|',
            prodNamePath: 'VueJS a-t-il un avenir?|',
            prodCreator: 'etco@rtbf.be',
            prodTeam: ['etco@rtbf.be', 'bbp@rtbf.be', 'vgu@rtbf.be'],
            prodParentTeam: ['cgo@rtbf.be', 'olpa@rtbf.be'],
            prodSharedWith: ['phbo@rtbf.be'],
            // prodKillDate: addToDate(new Date(), { days: 20 }),
            // prodKillDateHuman: this.myFormatDate(addToDate(new Date(), { days: 20 })),
            serie: 'QALU',
            serieTeam: ['etco@rtbf.be', 'bbp@rtbf.be']
          }
        }
      },

      // etco: l'utilisateur connecté à l'Intraprod
      loggedUser: 'etco@rtbf.be',

      /* Datatable */
      columns: [
        {
          name: 'thumb',
          required: true,
          label: 'Icone',
          align: 'left',
          field: 'thumb',
          sortable: false
        },
        {
          name: 'name',
          required: true,
          label: 'Nom du fichier',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'fileSize',
          required: true,
          label: 'Poids du fichier',
          align: 'left',
          field: 'idp.fileSize',
          sortable: true
        },
        {
          name: 'killDate',
          required: true,
          label: 'Date de purge',
          align: 'left',
          field: 'idp.killDate',
          sortable: true
        },
        {
          name: 'ingestStatus',
          required: true,
          label: 'Statut',
          align: 'left',
          field: 'ingestStatus',
          sortable: true
        },
        {
          name: 'actionBtns',
          required: true,
          label: 'Supprimer',
          align: 'left',
          field: 'actionBtns',
          sortable: true
        }
      ],
      columnsRunningIngests: [
        {
          name: 'thumb',
          required: true,
          label: 'Icone',
          align: 'left',
          field: 'thumb',
          sortable: false
        },
        {
          name: 'name',
          required: true,
          label: 'Nom du fichier',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'fileSize',
          required: true,
          label: 'Poids du fichier',
          align: 'left',
          field: 'idp.fileSize',
          sortable: true
        },
        {
          name: 'killDate',
          required: true,
          label: 'Date de purge',
          align: 'left',
          field: 'idp.killDate',
          sortable: true
        },
        {
          name: 'ingestStatus',
          required: true,
          label: 'Statut',
          align: 'left',
          field: 'ingestStatus',
          sortable: true
        }
      ],
      selectedFiles: [],
      filter: '',
      visibleColumns: ['thumb', 'name', 'fileSize', 'killDate', 'ingestID'],
      separator: 'horizontal',
      selection: 'multiple',
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 0 // current rows per page being displayed -> 0 = ALL
      }
      // paginationControl: { rowsPerPage: 3, page: 1 },
      /*
      selectedSecond: [
        // { name: 'Eclair' }
      ]
      */
    }
  },
  watch: {
    /*
    'paginationControl.page' (page) {
      this.$q.notify({
        color: 'secondary',
        message: `Navigated to page ${page}`,
        actions: page < 4
          ? [{
            label: 'Go to last page',
            handler: () => {
              this.paginationControl.page = 4
            }
          }]
          : null
      })
    },
    */
    // etco: j'écoute si l'array "ingests.currentIngest.files" est modifié (en gros si une checkbox de sélection est toggled)
    'ingests.currentIngest.files' () {
      this.checkboxToggled('toto')
    }
  },
  methods: {
    ...mapActions([]), // etco: j'importe toutes les "actions" de mes stores
    myIngestMethod (val) {
      console.log('toto = ' + this.$store.getters['ingests/isCurrentIngestObjectEmpty'])
      if (this.$store.getters['ingests/isCurrentIngestObjectEmpty']) { // s'il n'y a pas encore d'objet "currentIngest"
        console.log('emptyCurrentIngest_etco')
      }
      // return this.$store.commit('ingests/updateMyIngests', val)
    },
    // etco: méthode qui me crée un id ING
    newIngestId () {
      return 'ING' + formatDate(new Date(), 'YYYYDDMMHHmmss')
    },
    // etco: méthode qui déclenche l'ingest
    startGlobalIngest () {
      // Transfert des fichiers sélectionnnés dans un objet dédié à cet ingest
      console.log('startGlobalIngest')
      // Ajustement de qques métadonnées
      this.ingests.currentIngest.ingestId = this.newIngestId()
      this.ingests.runningIngests.push(this.ingests.currentIngest)
      // ATTENTION: je ne dois supprimer de "files" QUE les fichiers qui étaient sélectionnés. Les autres doivent rester
      for (var i = 0; i < this.ingests.currentIngest.files.length; i++) {
        // console.log(this.ingests.currentIngest.files[i].fileName)
        var index = this.files.indexOf(this.ingests.currentIngest.files[i])
        this.files.splice(index, 1)
      }
      this.ingests.currentIngest = JSON.parse(JSON.stringify(this.ingests.emptyPattern)) // Je copie le "emptyPattern"
      // Je lance l'ingest
      this.simulateIngestPayload()
    },
    // etco: quand une checkBox est cliquée ou quand la checkbox générale est cliquée, je peux déclencher des actions
    checkboxToggled (file) {
      console.log('checkboxToggled')
      if (this.ingests.currentIngest.ingestUploadStatus === 'stopped') {
        // console.log('simulateUpload')
        this.simulateUpload()
      }
      // Je regarde s'il n'y a pas un fichier qui vient de se rajouter et dont l'upload avait été mis en pause. Auquel cas je dois remettre son statut à "Waiting for upload"
      for (var i = 0; i < this.ingests.currentIngest.files.length; i++) {
        if (this.ingests.currentIngest.files[i].idp.ingestStatus.code === 6 && this.ingests.currentIngest.files[i].idp.uploadPercentage < 100) {
          this.ingests.currentIngest.files[i].idp.ingestStatus = this.ingestStatus[1]
        }
      }
    },
    deleteRow (fileToDelete) {
      this.$q.notify({
        color: 'secondary',
        icon: 'delete',
        message: `Le fichier ${fileToDelete.name} a été retiré de la liste`
      })
      var index1 = this.ingests.currentIngest.files.indexOf(fileToDelete) // Si le fichier était sélectionné (présent dans l'array ci-dessous), alors je le supprime
      if (index1 >= 0) {
        this.ingests.currentIngest.files.splice(index1, 1)
      }
      var index2 = this.files.indexOf(fileToDelete)
      this.files.splice(index2, 1)
    },
    // etco: Methode qui rend human readable un poids de fichier
    formatedFileSize (sizeToConvert) { // Je reçois le poids de mon fichier via une variable dans le template
      return humanStorageSize(sizeToConvert)
    },
    // etco: myFormatDate
    myFormatDate (dateToFormat) {
      dateToFormat = formatDate(dateToFormat, 'D MMMM YYYY', {
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      })
      return dateToFormat
    },
    // etco: simulation d'ingest des fichiers -> payload Ingest + simulation du temps d'ingest en fonction du poids -> process parallèles
    simulateIngestPayload () {
      // Chercher dans runningIngests s'il y a des fichiers uploadés
      for (var i = 0; i < this.ingests.runningIngests.length; i++) {
        console.log('runningIngest ' + i)
        for (var j = 0; j < this.ingests.runningIngests[i].files.length; j++) {
          let fileToIngest = this.ingests.runningIngests[i].files[j]
          console.log('runningIngest ' + i + ' file ' + j)
          // Pour chaque fichier uploadé...
          if (fileToIngest.idp.ingestStatus.code === 3) {
            console.log('runningIngest ' + i + ' file ' + j + ' à envoyer')
            // ... créer le payload d'ingest...
            fileToIngest.idp.ingestPayload = {}
            // Je vérifie si ce fichier est le dernier de son ingest
            let isLatestFileOfIngest = false
            if (j === this.ingests.runningIngests[i].files.length - 1) {
              isLatestFileOfIngest = true
            }
            // ... lancer un timeout pour ce fichier, proportionnel au poids du fichier
            this.simulateIngestDuration(fileToIngest, isLatestFileOfIngest, this.ingests.runningIngests[i].ingestId)
            // ... passer le statut d'ingest à "Ingest started"
            fileToIngest.idp.ingestStatus = this.ingestStatus[4]
          }
          console.log('tous les fichiers de runningIngest sont envoyés')
        }
      }
    },
    // etco: je simulae la durée d'ingest proportionnelement au poids du fichier, puis je cloture l'ingest
    simulateIngestDuration (fileToIngest, isLatestFileOfIngest, ingestId) {
      console.log(isLatestFileOfIngest + ' - ' + ingestId)
      setTimeout(() => {
        // Quand l'ingest est terminé je passe le statut à "Ingested"
        fileToIngest.idp.ingestStatus = this.ingestStatus[5]
        // Je regarde si tous les fichiers de cet ingest sont ingestés ou pas
        if (isLatestFileOfIngest) {
          console.log('ce fichier est le dernier')
          // Je transfère cet ingest dans le tableau des ingests terminés
          for (var i = 0; i < this.ingests.runningIngests.length; i++) {
            if (this.ingests.runningIngests[i].ingestId === ingestId) {
              this.ingests.successIngests.push(this.ingests.runningIngests[i])
              this.ingests.runningIngests.splice(i, 1)
            }
          }
        }
      }, fileToIngest.size / 100)
    },
    simulateUpload (previousFile) {
      // console.log(previousFile)
      this.ingests.currentIngest.ingestUploadStatus = 'running'
      setTimeout(() => {
        let file = Object
        // Je cherche un fichier à uploader
        // Je vais d'abord voir dans les "runningIngests" s'il reste des fichiers à uploader
        if (this.ingests.runningIngests.length > 0) {
          // console.log('runningIngests.length = ' + this.ingests.runningIngests.length)
          for (var i = 0; i < this.ingests.runningIngests.length; i++) {
            // console.log('runningIngest ' + i)
            for (var j = 0; j < this.ingests.runningIngests[i].files.length; j++) {
              // console.log('runningIngest ' + i + ' file ' + j)
              if (!this.ingests.runningIngests[i].files[j].success) {
                // console.log('runningIngest ' + i + ' file ' + j + ' à uploader')
                file = this.ingests.runningIngests[i].files[j] // C'est ce fichier-ci qu'il faut uploader
                if (previousFile && previousFile !== file && previousFile.idp.uploadPercentage < 100) {
                  previousFile.idp.ingestStatus = this.ingestStatus[6]
                  // console.log('ingest arreté')
                }
                // console.log('uploading: ' + i)
                // console.log(file.success)
                break
              }
              console.log('tous les fichiers de runningIngest sont uploadés')
            }
          }
        }
        // } else if (this.ingests.currentIngest.files.length > 0) {
        // Maintenant je regarde s'il y a des "currentIngests" à uploader
        if (Object.keys(file).length === 0) { // Si "files" est un objet vide, c'est qu'il n'y a pas / plus de runninIngests à traiter
          // console.log('currentIngest.files.length = ' + this.ingests.currentIngest.files.length)
          for (var k = 0; k < this.ingests.currentIngest.files.length; k++) {
            // console.log(this.ingests.currentIngest.files.length)
            // console.log(this.ingests.currentIngest.files[k].success)
            if (!this.ingests.currentIngest.files[k].success) {
              file = this.ingests.currentIngest.files[k] // C'est ce fichier-ci qu'il faut uploader
              if (previousFile && previousFile !== file && previousFile.idp.uploadPercentage < 100) {
                previousFile.idp.ingestStatus = this.ingestStatus[6]
                // console.log('ingest arreté')
              }
              // console.log('uploading: ' + k)
              // console.log(file.success)
              break
            }
          }
        }
        if (Object.keys(file).length === 0) { // Si "files" est un objet vide, c'est qu'il n'y a plus d'upload à faire
          if (previousFile && previousFile !== file && previousFile.idp.uploadPercentage < 100) {
            previousFile.idp.ingestStatus = this.ingestStatus[6]
            // console.log('ingest arreté')
          }
          this.ingests.currentIngest.ingestUploadStatus = 'stopped'
          console.log('stopped, aucun fichier trouvé')
        } else { // Si "files" n'est pas un objet vide
          if (file.idp.uploadSize <= file.size) {
            file.idp.ingestStatus = this.ingestStatus[2]
            file.idp.uploadSize = file.idp.uploadSize + 100000
            file.idp.uploadPercentage = Math.round(file.idp.uploadSize / file.size * 100)
            // console.log(file.idp.uploadPercentage)
            this.simulateUpload(file)
          } else {
            file.success = true
            file.idp.ingestStatus = file.idp.ingestStatus = this.ingestStatus[3]
            file.idp.uploadPercentage = 100
            this.simulateUpload(file)
          }
        }
      }, 200)
    },
    /*
    // etco: méthode qui calcule le pourcentage total et le poids total
    getTotalUploadSize () {
      var uploadedTotalSize = 0
      var totalSize = 0
      var totalUploadPercentage = 0
      for (var i = 0; i < this.files.length; i++) {
        totalSize = totalSize + this.files.length[i].size
        uploadedTotalSize = uploadedTotalSize + this.files.length[i].idp.uploadSize
        totalUploadPercentage = Math.round(uploadedTotalSize / totalSize * 100)
        console.log(totalUploadPercentage)
      }
    },
    */
    inputFilter (newFile, oldFile, prevent) {
      // console.log('etco-inputFilter')
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
        // etco: add some properties to each file
        newFile.idp = {
          fileSize: this.formatedFileSize(newFile.size),
          production: 'production',
          prodID: 'prodID',
          ingestID: this.IDgenerator,
          killDate: this.killDateInTenDays,
          uploadSize: 0,
          uploadPercentage: 0,
          ingestStatus: this.ingestStatus[1],
          ingestPayload: {}
        }
        if (this.$store.getters['ingests/isCurrentIngestObjectEmpty']) { // s'il n'y a pas encore d'objet "currentIngest"
        // if (this.$store.getters.isCurrentIngestObjectEmpty) { // s'il n'y a pas encore d'objet "currentIngest"
          console.log('emptyCurrentIngest')
          this.$store.commit('ingests/currentIngestInit', {
            ingestProdId: 'QALU20180509000001'
          })
          // etcoInMutator: this.ingests.currentIngest = JSON.parse(JSON.stringify(this.ingests.emptyPattern)) // Je copie le "emptyPattern"
          // etcoInMutator: this.ingests.currentIngest.ingestProdId = 'QALU20180509000001'
          // this.ingests.currentIngest.ingestId = this.IDgenerator
          // etcoInMutator: this.ingests.currentIngest.ingestCreationDate = new Date()
          // etcoInMutator: this.ingests.currentIngest.ingestCreationDateHuman = this.myFormatDate(this.ingests.currentIngest.ingestCreationDate)
          // etcoInMutator: this.ingests.currentIngest.ingestCreator = this.loggedUser
          // console.log(this)
        }
        // this.selectedFiles.push(newFile)
        this.$store.commit('ingests/currentIngestAddFile', {
          newFile: newFile
        })
        this.ingests.currentIngest.files.push(newFile)
        this.ingests.currentIngest.ingestTotalSize += newFile.size
        this.ingests.currentIngest.ingestTotalSizeHuman = humanStorageSize(this.ingests.currentIngest.ingestTotalSize)
        // this.simulateProgress(newFile)
        if (this.ingests.currentIngest.ingestUploadStatus === 'stopped') {
          console.log('simulateUpload')
          this.simulateUpload()
        }
      }
    },
    // add, update, remove File Event
    inputFile (newFile, oldFile) {
      console.log('etco-inputFile')
      if (newFile && oldFile) {
        // update
        console.log('etco-update')
        if (newFile.active && !oldFile.active) {
          console.log('etco-update-2')
          // beforeSend
          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
        }
        if (newFile.progress !== oldFile.progress) {
          // progress
          console.log('etco-progress')
        }
        if (newFile.error && !oldFile.error) {
          // error
          console.log('etco-error')
        }
        if (newFile.success && !oldFile.success) {
          // success
          console.log('etco-success')
        }
      }
      if (!newFile && oldFile) {
        // remove
        console.log('etco-remove')
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }
      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    alert (message) {
      alert(message)
    }
  }
}
</script>
