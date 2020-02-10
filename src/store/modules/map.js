import Vue from 'vue'

const state = {
  devicePanelCtrl: {
    visible: false,
    id: '',
  },
}

const mutations = {
  SET_DEVICE_PANEL(state, ctrl) {
    state.devicePanelCtrl = {
      ...state.devicePanelCtrl,
      ...ctrl,
    }
  },
}

const actions = {
  OPEN_DEVICE_PANEL({ commit, dispatch }, { id }) {
    if (!id) {
      console.warn('OPEN_DEVICE_PANEL action not found id')
      return
    }

    dispatch('CLOSE_DEVICE_PANEL')
    Vue.nextTick(() => {
      commit('SET_DEVICE_PANEL', { visible: true, id })
    })
  },

  CLOSE_DEVICE_PANEL({ commit }) {
    commit('SET_DEVICE_PANEL', { visible: false, id: '' })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
