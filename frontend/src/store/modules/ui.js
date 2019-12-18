import config from '../../../bin/config';

export default {
    state: {
        ...config.ui,
    },
    mutations: {
    },
    getters: {
        uiGetThemeColor: (state) => `${state.theme.backgroundColor} ${state.theme.fontColor}`,
        uiGetThemeFontColor: (state) => state.theme.fontColor,
        uiGetThemeBackgroundColor: (state) => state.theme.backgroundColor,
    },
    actions: {
    }
}