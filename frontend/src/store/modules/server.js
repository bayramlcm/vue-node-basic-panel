import config from '../../../bin/config';

export default {
    state: {
        ...config.server,
    },
    mutations: {
    },
    getters: {
        serverGetName: (state) => state.name,
    },
    actions: {
    }
}