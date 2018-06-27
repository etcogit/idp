<template>
  <q-page padding>
    <!-- content -->
    <q-search v-model="query.searchFullText" autofocus="true" />
    <q-datetime v-model="query.startSearchDate" type="datetime" :first-day-of-week="1" format24h float-label="Entre... (date de début)" />
    <q-datetime v-model="query.endSearchDate" type="datetime" :first-day-of-week="1" format24h float-label="... et (date de fin)" />
    <q-btn label="Get data" @click.native="getLogsAction(query)" />
    <!-- à rajouter dans q-table pour filtrer les éléments de la table
      :filter="globalFilter"
      :filter-method="filterInRawData"
    -->
    <q-table
      dense
      :data="dbLogs.results"
      :columns="columns"
      row-key="id"
      color="secondary"
      :pagination.sync="pagination"
    >
      <template slot="top-left" slot-scope="props">
        <q-search
          hide-underline
          color="secondary"
          v-model="globalFilter"
          class="col-6"
        />
      </template>
      <template slot="body" slot-scope="props">
        <q-tr :props="props" @click.native="props.expand = !props.expand, formatLogMutation([props.row.raw, props.row.__index])" class="cursor-pointer">
          <q-td key="date" :props="props">
            {{ props.row.raw.frontendTimeStamp }}
          </q-td>
          <q-td key="route" :props="props">
            {{ props.row.raw.route }}
          </q-td>
          <q-td key="action" :props="props">{{ props.row.raw.frontendAction }}</q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-tree
              :nodes="props.row.treeFormatted"
              :filter="globalFilter"
              default-expand-all
              node-key="label"
            />
            <!--
            <q-btn label="jsonToArray" @click.native="formatLogMutation([props.row.raw, props.row.__index])" />
            <json-tree :data="props.row.raw"></json-tree>
            -->
            <!-- <div class="text-left">{{ props.row }}</div> -->
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import JsonTree from 'v-json-tree'
import Vue from 'vue'
Vue.use(JsonTree)
import { date } from 'quasar'

export default {
  mounted () {
    this.saveLogAction({})
  },
  computed: {
    ...mapState(
      'dbModule',
      [
        'dbLogs'
      ]
    )
  },
  methods: {
    ...mapMutations(
      'dbModule',
      [
        'formatLogMutation'
      ]
    ),
    ...mapMutations(
      'globalModule',
      [
        'jsonDebugMutation'
      ]
    ),
    ...mapActions(
      'globalModule',
      [
        'saveLogAction'
      ]
    ),
    ...mapActions(
      'dbModule',
      [
        'getLogsAction'
      ]
    )
    /* Pas utilisé pcq c'est trop lourd de faire une recherche "full text" en frontend sur tous les résultats chargés dans ma grille
    ,
    filterInRawData (rows, globalFilter, cols, cellValue) {
      this.jsonDebugMutation({rows: rows, globalFilter: globalFilter, cols: cols, cellValue: cellValue})
      const lowerTerms = globalFilter ? globalFilter.toLowerCase() : ''
      return rows.filter(
        // row => cols.some(col => (cellValue(col, row.raw) + '').toLowerCase().indexOf(lowerTerms) !== -1)
        row => JSON.stringify(row.raw).toLowerCase().indexOf(lowerTerms) !== -1
      )
    }
    */
  },
  data () {
    return {
      globalFilter: '',
      query: { // J'instancie toutes les varibles relatives aux champs de mon formulaire de recherche
        startSearchDate: date.startOfDate(date.subtractFromDate(new Date(), { days: 1 }), 'day'), // hier minuit
        endSearchDate: date.endOfDate(new Date(), 'day'), // ce soir
        searchFullText: ''
      },
      columns: [
        {
          name: 'date',
          required: true,
          label: 'Date',
          align: 'left',
          field: 'createdAt',
          sortable: true
        },
        {
          name: 'route',
          required: true,
          label: 'Page',
          align: 'left',
          field: 'route',
          sortable: true
        },
        {
          name: 'action',
          required: true,
          label: 'Action',
          align: 'left',
          field: 'action',
          sortable: true
        }
      ],
      visibleColumns: ['date', 'route', 'action'],
      separator: 'horizontal',
      pagination: {
        rowsPerPage: 0
      }
    }
  }
}
</script>

<style>
</style>
