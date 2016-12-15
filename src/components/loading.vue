<template lang="html">
  <div class="mask">
    <img class="loading" src="../assets/loading.png" alt="">
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  mounted() {
    // Vue.http.interceptors.push((request, next)  => {
    //
    //   // modify request
    //   console.log(22222)
    //
    //   // continue to next interceptor
    //   next((response) => {
    //
    //     // modify response
    //     // response.body = '...';
    //
    //   });
    // });
  }
}
</script>

<style lang="css">
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0);
  z-index: 100;
}
.loading {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  /*transform: translate(-50%, -50%);*/
  animation: rotate 1s infinite linear;
}
@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

</style>
