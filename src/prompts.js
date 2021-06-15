module.exports = function () {
  return [
    {
      name: 'server_graphql_base_url',
      type: 'input',
      required: true,
      message: "URL for Graphql server",
      default: 'http://localhost'
    },
    {
      name: 'server_graphql_base_url_subscription',
      type: 'input',
      required: true,
      message: "URL for Graphql subscription",
      default: 'wss://localhost'
    },
    {
      name: 'vuex_getters_token',
      type: 'input',
      required: true,
      message: "Vuex getter token information",
      default: 'rxdb/getToken'
    },
    {
      name: 'vuex_getters_db_name',
      type: 'input',
      required: true,
      message: "Vuex getter db name information",
      default: 'rxdb/getDbName'
    }
  ]
}
