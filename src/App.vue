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
  }
}
</script>
<style lang="scss">
  html,body{
      width: 100%;
      height: 100%;
      background: #cccccc;
  }
  *{
      padding: 0;
      margin: 0;
      box-sizing: border-box;
  }
  .ivu-layout{
    height: 100%;
  }
  li,ol,ul{
    list-style: none;
  }
  .ivu-layout-content{
    flex: 1;
    overflow: auto;
  }
</style>
