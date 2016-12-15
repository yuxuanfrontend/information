<template lang="html">
  <div class="subleft">
    <h2>文章管理</h2>
    <div class="ulbox">
      <ul>
        <li v-bind:class="{active:isSelsct}"><router-link to="/content/information">资讯管理</router-link></li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name : 'subleft',
  data () {
    return {
      isSelsct : true
    }
  }
}
</script>

<style>
ul,li{
  list-style:none;
}
.subleft h2{
  margin-top:60px;
  font-weight:normal;
  font-size:16px;
  height:48px;
  line-height:48px;
}
.ulbox ul li{
  height:36px;
  line-height:36px;
}
.ulbox ul li a{
  color:#666;
  font-size:14px;
  cursor:pointer;
  width: 100%;
}
.active{
  background: #dbdbdb;
}
</style>
