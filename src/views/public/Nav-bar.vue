<template lang="pug">
  Layout.nav-bar
    Content
      Menu(mode='horizontal',theme="dark",:active-name="menuManager",@on-select="menuChange")
        MenuItem(name='/my-system')
          | 我的项目
        MenuItem(name='/my-interface')
          | 我的接口
        MenuItem(name='/system-manager')
          | 项目管理
    Sider(hide-trigger)
      Menu(mode='horizontal',theme="dark",:active-name="menuManager",@on-select="menuChange")
        MenuItem(name='/login')
          | 登陆
        MenuItem(name='/register')
          | 注册
        MenuItem(name='/logout')
          | 注销
</template>
<script>
export default {
  data(){
    return{
      menuManager:'',
    }
  },
  watch:{
    routerPath(val){
      this.menuManager = val;
    },
  },
  computed:{
    routerPath(){
      return this.$store.state.auth.routerPath;
    },
  },
  methods:{
    menuChange(val){
      // this.$store.commit('ROUTER_PATH',val);
      console.log(val)
      this.menuManager = val;
      this.$router.push(val);
    },
  }
}
</script>

<style lang="scss" scoped>
  .nav-bar{
    .ivu-menu-horizontal{
      height: 100%;
    }
    .ivu-layout-sider{
      flex: initial!important;
      width: auto!important;
      min-width: auto!important;
      max-width: inherit!important;
    }
  }
</style>
