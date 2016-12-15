<template lang="html">
  <div class="content">
    <subleft></subleft>
    <router-view></router-view>
  </div>
</template>

<script>
import subleft from './subleft'
import information from './information'
import articleeditors from './articleEditors'
export default {
  name : 'content',
  components: {
    subleft,
    information,
    articleeditors
  },
}
</script>

<style lang="css">
</style>
