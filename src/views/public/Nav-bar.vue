<template lang="pug">
  Layout.nav-bar
    Content
      Menu(mode='horizontal',theme="dark",:active-name="menuManager",@on-select="menuChange")
        MenuItem(name='/system')
          | 项目管理
        MenuItem(name='/interface')
          | 接口管理
    Sider(hide-trigger)
      Menu(mode='horizontal',theme="dark",:active-name="menuManager",@on-select="menuChange")
        MenuItem(v-if="userInfo.userName",name='/mine/center')
          | {{userInfo.userName}}
        MenuItem(v-else,name='/mine/login')
          | 登陆
        MenuItem(name='/mine/register')
          | 注册
        MenuItem(name='/mine/logout')
          | 注销
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data(){
    return{
    }
  },
  computed:{
    ...mapGetters([
      'userInfo'
    ]),
    menuManager(){
      let path = this.$route.path;
      if(/^\/interface/.test(path)) path = '/interface';
      return path || '';
    },
  },
  async created(){
    if(!this.userInfo.userName){
      const ret = await this.$axios.get('/user/userInfo')
      if(ret.ok){
        this.$store.commit('USER_INFO',ret.data);
      } else {
        this.$store.commit('LOGOUT');
        this.$Message.error('请重新登录');
        this.$router.push('/user/login');
      }
    }
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
    background: #495060;
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
