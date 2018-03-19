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
        Button(type='primary') 登陆
        Button(type='dashed',@click='$router.push("/register")') 去注册
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


