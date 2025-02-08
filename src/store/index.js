import { createStore } from 'vuex'
/**
 * 创建仓库和导出
 */
export default createStore({
    state: {
        location:null,
        isLoggedIn:  !!localStorage.getItem('token'),
    },
    mutations: {
        SET_LOGGED_IN(state, status) {
          state.isLoggedIn = status;
          if (status) {
            // 如果登录，确保 token 存在于 localStorage
            localStorage.setItem('token', 'your_token_here'); // 这里应该是实际的 token
          } else {
            // 如果登出，移除 localStorage 中的 token
            localStorage.removeItem('token');
          }
        },
      },
      actions: {
        login({ commit }, token) {
          // 登录逻辑
          commit('SET_LOGGED_IN', true);
          localStorage.setItem('token', token); // 存储 token 到 localStorage
        },
        logout({ commit }) {
          // 登出逻辑
          commit('SET_LOGGED_IN', false);
          localStorage.removeItem('token'); // 移除 localStorage 中的 token
        },
      },
      getters: {
        isLoggedIn: state => state.isLoggedIn,
      },
})