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
      name: 'vuex_set_token_getters',
      type: 'input',
      required: true,
      message: "Vuex getter token information",
      default: 'rxdb/getToken'
    },
    {
      name: 'vuex_set_db_name_getters',
      type: 'input',
      required: true,
      message: "Vuex getter db name information",
      default: 'auth/getDbName'
    }
  ]
}
