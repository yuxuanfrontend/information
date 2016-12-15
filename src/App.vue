<template>
  <div id="app">
    <headwarp></headwarp>
    <router-view></router-view>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import Vue from 'vue'
import headwarp from './components/headwarp'
import login from './components/login'
import loading from './components/loading'

export default {
  name: 'app',
  data() {
    return {
      showLoading: false
    }
  },
  components: {
    headwarp,
    login,
    loading
  },
  created() {
    Vue.http.interceptors.push((request, next)  => {

      // modify request
      this.showLoading = true
      request.headers.set('backend-user-token', window.localStorage.token || '')

      // continue to next interceptor
      next((response) => {
        this.showLoading = false
        if (response.body.code === 401) {
          alert('登录信息失效，请重新登录')
          this.$router.push('/login')
          this.$store.commit('setIsLogin', false)
          return false
        } else {
          this.$store.commit('setIsLogin', true)
        }
        // modify response
        // response.body = '...';

      });
    });
  }
}
</script>

<style>
html,body{
  height:100%;
}
#app {
  font-family: '微软雅黑','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:#2c3e50;
  width:1200px;
  height: 100%;
  margin:0 auto;
  position: relative;
  background: #f3f3f3;
}
*{
  margin: 0;
  padding: 0;
}
a{
  text-decoration: none;
}
table tr td{
  border:none;
  padding:10px;
  font-size: 14px;
}
.subleft{
  width: 200px;
  height:100%;
  background: #eaeaea;
  position: absolute;
  left:0;
  top:0;
  z-index:1;
}
.contright{
  width:978px;
  background:#fff;
  position:absolute;
  left:210px;
  top:70px;
  border:1px solid #dbdbdb;
}
</style>
