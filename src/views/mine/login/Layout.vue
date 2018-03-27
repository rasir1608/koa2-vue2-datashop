<template lang="pug">
  .login
    h3 欢迎登陆
    ul
      li
        span 账号：
        Input(v-model='userInfo.account',type='text')
      li
        span 密码：
        Input(v-model='userInfo.password',type='password')
      li
        Button(type='primary',@click="submit") 登陆
        Button(type='dashed',@click='$router.push("/mine/register")') 去注册
</template>
<script>
export default {
  data(){
    return{
      userInfo:{
        account:'',
        password:'',
      }
    }
  },
  methods:{
    async submit(){
      if(this.userInfo.account && this.userInfo.password){
        const ret = await this.$axios.post('/user/login',this.userInfo);
        if(ret.ok){
          console.log(30,ret)
          this.$store.commit('SET_TOKEN',ret.data.token);
          this.$store.commit('USER_INFO',ret.data.userInfo);
          this.$router.push('/');
          this.$Message.success(`恭喜登录成功！`);
        } else {
          this.$Message.error(`${ret.msg},请重新登录`);
        }
      } else {
        this.$Message.error('请填写账号密码！');
      }
    },
  },
}
</script>
<style lang="scss">
  .login{
    width: 500px;
    margin: 50px auto;
    h3{
      font-size: 18px;
      line-height: 36px;
      text-align: center;
    }
    li{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 10px;
      .ivu-input-wrapper{
        flex: 1;
      }
      .ivu-input{
        line-height: 36px;
        height: 36px;
      }
      &:last-of-type{
        justify-content: flex-end;
        button{
          margin: 0 5px;
        }
      }
    }
  }
</style>


