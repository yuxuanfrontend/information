<template>
  <div class="">
    <div class="header">
      <img src="../assets/u324.jpg" alt="">上文引立
      <a class="loginlink" v-on:click="loginbtn">{{loginTxt}}</a>
      <a class="fetch" v-on:click="fetch" v-if="$store.state.isLogin">退出</a>
    </div>
  </div>

</template>
<script>
export default {
  name: 'headwarp',
  data () {
    return {
    }
  },
  computed: {
    loginTxt() {
      if (this.$store.state.isLogin) {
        return 'admin'
      } else {
        return '请登录，亲'
      }
    }
  },
  methods:{
    loginbtn(){
      if(this.$store.state.isLogin){
        return false
      }else{
        this.$router.push('/login')
      }
    },
    fetch(){
      this.$http.get('https://backend-api.yinli99.com/api/wechat/operation/logout?token='+window.localStorage.token).then((res)=>{
        console.log(res)
        this.$router.push('/login')
        this.$store.commit('setIsLogin', false)
      },(err)=>{
        console.log(111)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header{
  height:60px;
  line-height:60px;
  width:100%;
  text-align:left;
  font-family: "微软雅黑";
  font-size:16px;
  background: #fff;
  position: absolute;
  z-index:2;
}
.header img{
  width:40px;
  height:40px;
  vertical-align:middle;
  margin:0 10px;
}
.loginlink,.fetch{
  cursor: pointer;
  float: right;
  color: #347ab6;
  font-size: 14px;
  margin: 0 10px;
}
</style>
