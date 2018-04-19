<template lang="pug">
  .mine-center
    .mine-header
      img(:src="userInfo.headerUrl ? `${userInfo.account}/${userInfo.headerUrl}` : headerImg")
      .mine-base-info
        div
          span.label 帐号： 
          span.content {{userInfo.account}}
        div
          span.label 用户名： 
          Input.content(v-if="userNameActive",v-model="userName")
          span.content(v-else) {{userInfo.userName}}
          Button(type="primary",size="small",@click="changeUserName") {{userNameActive ? '保存' : '修改'}}
        div.change-header
          .upload-header
            Button.upload-header-btn(type="primary",size="large") 修改头像
            input(type="file",@change="uploadImage")
          Button(type="primary",size="large",@click="changePassword = true") 修改密码
    .mine-args
    Modal.password-form(v-model="changePassword",@on-ok="submitPassword")
      Form(ref="passwordForm",:model="password",inline,:label-width="100",:rules="passwordRules",)
        FormItem(prop="oldPassword",label="旧密码：")
          Input(type="text",v-model="password.oldPassword",placeholder="请输入")
        FormItem(prop="newPassword",label="新密码：")
          Input(type="text",v-model="password.newPassword",placeholder="请输入")
        FormItem(prop="makesurPassword",label="确认密码：")
          Input(type="text",v-model="password.makesurPassword",placeholder="请输入")

</template>
<script>
import { mapGetters,mapActions } from 'vuex';
export default {
  data () {
    return {
      headerImg:'static/image/header.jpg',
      changePassword:false,
      userNameActive:false,
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
      },
      imageFile:'',
    }
  },
  watch:{
    changePassword(va){
      if(!va) this.$refs['passwordForm'].resetFields();
    },
  },
  computed: {
    userInfo(){
      return this.$store.state.auth.userInfo;
    },
  },
  created () {
    this.editeUserInfo = Object.assign({},this.userInfo);
  },
  methods: {
    ...mapActions([
      'getMyUserInfo'
    ]),
    async uploadImage(event){
      const e = event || window.event;
      const target = e.target;
      const file = target.files[0];
      const formData = new FormData();
      formData.append('file',file);
      formData.append('user',this.userInfo.rid);
      const config = {
         headers: {'Content-Type': 'multipart/form-data'}
      };
      const ret = await this.$axios.post('/userinfo/uploadImg',formData,config);
      if(ret.ok){
        this.getMyUserInfo();
        this.$Message.success(ret.msg);
      } else {
        this.$Message.error(ret.msg);
      }
    },
    submitPassword(){
      this.$refs['passwordForm'].validate(async (valid) => {
          if (!valid) {
              this.$Message.error('所有参数不能为空');
          } else {
            if(this.password.newPassword === this.password.makesurPassword){
              const ret = await this.$axios.post('/userinfo/updatePassword',{account:this.userInfo.account,...this.password})
              if(ret){
                this.$Message.success(ret.msg);
              } else {
                this.$Message.error(ret.msg);
              }
            } else {
              this.$Message.error('修改的密码两次输入不一致');
            }
          }
      })
    },
    changeUserName(){
      if(this.userNameActive){
        if(this.userInfo.userName !== this.userName) this.submitUserName();
        this.userNameActive = false;
      } else {
        this.userName = this.userInfo.userName;
        this.userNameActive = true;
      }
    },
    async submitUserName(){
      if(!this.userName) return;
      const ret =  await this.$axios.post('/userinfo/updateUserName',{id:this.userInfo.id,userName:this.userName});
      if(ret.ok){
        this.getMyUserInfo();
        this.$Message.success(ret.msg);
      } else {
        this.$Message.error(ret.msg);
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
            .upload-header{
              position: relative;
              overflow: hidden;
              width: 88px;
              height: 36px;
              border-radius: 4px;
              button{
                margin: 0;
              }
              input[type="file"]{
                position: absolute;
                width: 200%;
                height: 200%;
                right: 0;
                bottom: 0;
                z-index: 2;
                opacity: 0;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
</style>
<style>
    .password-form .ivu-form-inline .ivu-form-item{
      width: 100%;
    }
</style>
