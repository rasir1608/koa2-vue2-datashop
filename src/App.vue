<template lang="pug">
  Layout
    Header
      nav-bar
    Content
      router-view
    Footer
</template>
<script>
import NavBar from './views/public/Nav-bar';
export default {
  components:{
    NavBar
  },
  mounted () {
    console.log(this.$store.state)
  }
}
</script>
<style lang="scss">
  html,body{
    height: 100%;
    width: 100%;
  }
  .ivu-layout{
    height: 100%;
  }
</style>
