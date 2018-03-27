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
        li.ivu-menu-item(v-if="userInfo.name")
          | {{userInfo.name}}
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
  watch:{
  },
  computed:{
    ...mapGetters([
      'userInfo'
    ]),
    menuManager(){
      let path = this.$route.path;
      if(/^\/my-interface/.test(path)) path = '/my-interface';
      return path || '';
    },
  },
  async created(){
    if(!this.userInfo.name){
      const ret = await this.$axios.get('/user/userInfo')
      if(ret.ok){
        this.$store.commit('USER_INFO',ret.data.data);
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
