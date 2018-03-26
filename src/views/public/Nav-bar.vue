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
        MenuItem(name='/mine/login')
          | 登陆
        MenuItem(name='/mine/register')
          | 注册
        MenuItem(name='/mine/logout')
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
      let path = this.$route.path;
      if(/^\/my-interface/.test(path)) path = '/my-interface';
      return path || '';
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
