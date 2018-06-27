import axios from 'axios'

export default ({ Vue }) => {
  // axios.defaults.baseURL = 'https://idp-etcocloud9.c9users.io:8081'
  // axios.defaults.baseURL = Vue.prototype.$appConfig.restApiUrl
  Vue.prototype.$axios = axios
}
