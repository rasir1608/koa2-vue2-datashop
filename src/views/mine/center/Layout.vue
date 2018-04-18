<template lang="pug">
  .mine-center
    .mine-header
      img(src="static/image/header.jpg")
      .mine-base-info
        div
          span.label 帐号： 
          span.content {{editeUserInfo.account}}
        div
          span.label 用户名： 
          Input.content(v-if="changeUserName",v-model="editeUserInfo.userName")
          span.content(v-else) {{editeUserInfo.userName}}
          Button(type="primary",size="small",@click="changeUserName = !changeUserName") {{changeUserName ? '保存' : '修改'}}
        div.change-header
          Button(type="primary",size="large",@click="changeUserName = !changeUserName") 修改头像
          Button(type="primary",size="large",@click="changePassword = true") 修改密码
    .mine-args
    Modal(v-model="changePassword",@on-ok="submitPassword")
      Form(ref="password",:model="password",inline,:label-width="100",:rules="passwordRules",)
        FormItem(prop="oldPassword",label="旧密码：")
          Input(type="text",v-model="password.oldPassword",placeholder="请输入")
        FormItem(prop="newPassword",label="新密码：")
          Input(type="text",v-model="password.newPassword",placeholder="请输入")
        FormItem(prop="makesurPassword",label="确认密码：")
          Input(type="text",v-model="password.makesurPassword",placeholder="请输入")

</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      changePassword:false,
      changeUserName:false,
      password:{
        oldPassword:'',
        newPassword:'',
        makesurPassword:'',
      },
      editeUserInfo:{},
      passwordRules:{
        oldPassword:[
           { required: true, trigger: 'blur'}
        ],
        newPassword:[
           { required: true, trigger: 'blur'}
        ],
        makesurPassword:[
           { required: true, trigger: 'blur'}
        ],
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
  },
  created () {
    this.editeUserInfo = Object.assign({},this.userInfo);
  },
  methods: {
    async submitPassword(){
      
      if(this.password.newPassword === this.password.makesurPassword){
        const ret = await this.$axios.post('/user/updatePassword',{id:this.userInfo.id,...this.password})
        if(ret){
          this.$Message.success(ret.msg);
        } else {
          this.$Message.error(ret.msg);
        }
      } else {
        this.$Message.error('修改的密码两次输入不一致');
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .mine-center{
    width: 800px;
    margin: 0 auto;
    padding: 20px ;
    background: #ffffff;
    .mine-header{
      padding: 20px ;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border: 1px solid #cccccc;
      border-radius: 4px;
      img{
        width: 200px;
        height: 200px;
      }
      .mine-base-info{
        height: 200px;
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 20px;
        justify-content: space-around;
        align-items: flex-start;
        font-size: 14px;
        >div{
          width: 100%;
          line-height: 36px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .label{
            width: 65px;
          }
          .content{
            flex: 1;
          }
          button{
            margin:0 10px;
          }
          &.change-header{
            button{
              &:first-of-type{
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
<style>
    .ivu-form-inline .ivu-form-item{
      width: 100%;
    }
</style>
