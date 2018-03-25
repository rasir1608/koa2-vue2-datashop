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
    }
  },
  watch:{
  },
  computed:{
    menuManager(){
      const path = this.$route.path.match(/\/[a-zA-Z0-9-_]+/);
      return path ? path[0] : '';
    },
  },
  methods:{
    menuChange(val){
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
