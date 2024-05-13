import { ApolloClient, createNetworkInterface } from 'apollo-client'
import Vue from 'vue'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql',
});

const apolloClient = new ApolloClient({
  networkInterface,
  connectToDevTools: true,
})

import VueApollo from 'vue-apollo'
Vue.use(VueApollo);

let loading = 0

const apolloProvider = new VueApollo({
  clients: {
    a: apolloClient,
  },
  defaultClient: apolloClient,
  defaultOptions: {
    // $loadingKey: 'loading',
  },
  watchLoading (state, mod) {
    loading += mod
    console.log('Global loading', loading, mod)
  },
  errorHandler (error) {
    console.log('Global error handler')
    console.error(error)
  },
});

export default apolloProvider;