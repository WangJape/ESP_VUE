import { createStore } from 'vuex'

const store = createStore({
  state() {
    // 刷新后从sessionStorage中取数据
    return sessionStorage.getItem("state") !== null ?
      JSON.parse(sessionStorage.getItem("state")) :
      {
        userName: "未登录"
      }
  },
  getters: {
    getUserName(state) {
      return state.userName
    }
  },
  mutations: { // 同步方法
    setUserName(state, value) {
      state.userName = value
    }
  },
  actions: { // 异步方法
    setUserName(context, value) {
      context.commit('setUserName', value)
    }
  }
})
export default store;