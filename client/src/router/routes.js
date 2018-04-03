
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') }
    ]
  },

  {
    path: '/idp',
    component: () => import('layouts/idp_home'),
    children: [
      {
        path: '',
        component: () => import('pages/idp_home')
      },
      {
        path: 'my',
        component: () => import('pages/idp_my'),
        children: [
          {
            path: 'planning',
            component: () => import('pages/idp_my_planning')
          },
          {
            path: 'bcs',
            component: () => import('pages/idp_my_bcs')
          },
          {
            path: 'notifications',
            component: () => import('pages/idp_my_notifications')
          },
          {
            path: 'bookmarks',
            component: () => import('pages/idp_my_bookmarks')
          }
        ]
      },
      {
        path: 'ingest',
        component: () => import('pages/idp_ingest'),
        children: [
          {
            path: 'bornes',
            component: () => import('pages/idp_ingest_bornes')
          },
          {
            path: 'rec',
            component: () => import('pages/idp_ingest_rec')
          },
          {
            path: 'ftp',
            component: () => import('pages/idp_ingest_ftp')
          },
          {
            path: 'localFile',
            component: () => import('pages/idp_ingest_localFile')
          },
          {
            path: 'webLink',
            component: () => import('pages/idp_ingest_webLink')
          }
        ]
      },
      {
        path: 'help',
        component: () => import('pages/idp_help'),
        children: [
          {
            path: 'faq',
            component: () => import('pages/idp_help_faq')
          },
          {
            path: 'procedures',
            component: () => import('pages/idp_help_procedures')
          },
          {
            path: 'workflows',
            component: () => import('pages/idp_help_workflows')
          },
          {
            path: 'contact',
            component: () => import('pages/idp_help_contact')
          }
        ]
      },
      {
        path: 'settings',
        component: () => import('pages/idp_settings'),
        children: [
          {
            path: 'gui',
            component: () => import('pages/idp_settings_gui')
          },
          {
            path: 'notifications',
            component: () => import('pages/idp_settings_notifications')
          }
        ]
      },
      {
        path: 'monitoring',
        component: () => import('pages/idp_monitoring'),
        children: [
          {
            path: 'workflows',
            component: () => import('pages/idp_monitoring_bcWorkflows')
          },
          {
            path: 'openMedia',
            component: () => import('pages/idp_monitoring_openMedia')
          },
          {
            path: 'jobs',
            component: () => import('pages/idp_monitoring_jobs')
          },
          {
            path: 'platform',
            component: () => import('pages/idp_monitoring_platform')
          }
        ]
      },
      { path: 'bcs', component: () => import('pages/idp_bc') },
      { path: 'contacts', component: () => import('pages/idp_contacts') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
