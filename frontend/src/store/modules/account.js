import { apiToken, api } from '../../services/api'

export default {
    state: {
        login: null,
        user: {},
        token: null,
    },
    mutations: {
        accountLogin: (state, payload) => {
            localStorage.token = payload.token;
            state.token = payload.token;
            state.user = payload.user;
            state.login = true;
            apiToken(payload.token);
        },
        accountLogout: (state) => {
            localStorage.removeItem('token');
            state.login = null;
            state.user = {};
            state.token = null;
            apiToken(null);
        }
    },
    getters: {
        accountLoginGet: (state) => state.login,
        accountUser: (state) => state.user,
        accountUserPermissions: (state) => state.user.permissions,
    },
    actions: {
        // Kullanıcı girişi yap
        accountLogin: ({ commit }, payload) => {
            api.post('/login', payload)
                .then(({ data }) => {
                    if (data.type === true) {
                        commit('accountLogin', data.data);
                    }
                    commit('notificationSet', {
                        color: data.type === true ? 'success' : 'error',
                        text: data.message,
                    });
                })
                .catch(() => {
                    commit('notificationSet', {
                        text: 'Sunucuyla bağlantı kurulamadı.',
                    });
                })
        },
        // Kullanıcı giriş kontrolü
        accountLoginCheck: ({ commit, getters }) => new Promise((resolve, reject) => {
            if (getters.accountLoginGet === true) {
                resolve();
            }
            const { token } = localStorage;
            if (token) {
                return api.post('/login/check', { token })
                    .then(({ data }) => {
                        if (data.type === true) {
                            commit('accountLogin', data.data)
                            resolve();
                        } else {
                            commit('notificationSet', {
                                color: 'error',
                                text: data.message
                            });
                            commit('accountLogout');
                            reject();
                        }
                    }).catch(() => {
                        commit('notificationSet', {
                            text: 'Sunucuyla bağlantı kurulamadı.'
                        });
                        commit('accountLogout');
                        reject()
                    });
            }
            reject();
        }),
        // Çıkış Yap
        accountLogout: ({ commit }) => {
            commit('accountLogout');
        },
        // Tüm kullanıcı listesi
        accountGetUsers: ({ commit }) => new Promise((resolve, reject) => {
            api.post('/v1/account/getAll').then(({ data }) => {
                if (data.type === true) {
                    resolve(data.data);
                } else {
                    commit('notificationSet', {
                        color: 'error',
                        text: data.message
                    });
                    reject();
                }
            }).catch(() => {
                commit('notificationSet', {
                    text: 'Sunucuyla bağlantı kurulamadı.'
                });
                reject();
            });
        }),
        // Kullanıcı Düzenle
        accountUpdateUser: ({ commit }, payload) => new Promise((resolve, reject) => {
            api.post('/v1/account/update', payload).then(({data}) => {
                commit('notificationSet', {
                    color: data.type === true ? 'success' : 'error',
                    text: data.message
                });
                data.type === true ? resolve(data.data) : reject()
            }).catch(() => {
                commit('notificationSet', {
                    text: 'Sunucuyla bağlantı kurulamadı.'
                });
                reject();
            })
        }),
        // Kullanıcı ekle
        accountAddUser: ({commit}, payload) => new Promise((resolve, reject) => {
            api.post('/v1/account/add', payload).then(({data}) => {
                commit('notificationSet', {
                    color: data.type === true ? 'success' : 'error',
                    text: data.message,
                });
                data.type === true ? resolve(data.data) : reject()
            });
        }),
        // Kullanıcı sil
        accountDeleteUser: ({commit}, payload) => new Promise((resolve, reject) => {
            api.post('/v1/account/delete', payload).then(({data}) => {
                commit('notificationSet', {
                    color: data.type === true ? 'success': 'error',
                    text: data.message,
                });
                data.type === true ? resolve() : reject();
            });
        }),
    },
}