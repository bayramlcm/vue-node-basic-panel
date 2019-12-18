import Vue from 'vue';
import Vuex from 'vuex';

import Server from './modules/server';
import UI from './modules/ui';
import Account from './modules/account';
import Notification from './modules/notification';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    server: Server,
    ui: UI,
    account: Account,
    notification: Notification
  },
});
