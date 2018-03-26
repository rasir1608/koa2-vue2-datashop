<template lang="pug">
  .register
    h3 欢迎注册账号
    ul
      li
        span 申请账号：
        Input(v-model='userInfo.account',type='text')
      li
        span 输入密码：
        Input(v-model='userInfo.password',type='password')
      li
        span 确认密码：
        Input(v-model='userInfo.repassword',type='password')
      li
        Button(type='primary',@click='submit') 确认
        Button(type='dashed',@click='$router.push("/login")') 去登陆
</template>
<script>
export default {
  data(){
    return{
      userInfo:{
        account:'',
        password:'',
        repassword:'',
      }
    }
  },
  methods:{
    async submit(){
      if(!this.userInfo.account) {
        this.$Message.error('请输入账号');
        return;
      } 
      if(!this.userInfo.password){
        this.$Message.error('请输入密码');
        return;
      }
      if(this.userInfo.password !== this.userInfo.repassword) {
        this.$Message.error('两次密码输入不一致，请重新输入');
        this.userInfo.repassword = '';
      } else {
        const ret = await this.$axios.post('/user/register',{
          account:this.userInfo.account,
          password:this.userInfo.password
        })
        if(ret.ok){
          this.$Message.success('恭喜您注册成功！');
          this.$router.push('/login');
        } else {
          this.$Message.error(ret.msg+'请重新注册');
        }
      }
    },
  }
}
</script>
<style lang="scss">
  .register{
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


