<template lang="pug">
  .system-edite
    .system-data
      Form(ref="systemData",:model="systemData",:rules="createRules",:label-width="100")
        FormItem(prop="name",label="系统名称：")
          div {{systemData.name}}
        FormItem(prop="remarks",label="系统备注：")
          Input(type="textarea",v-model="systemData.remarks",placeholder="请填入系统备注")
        FormItem.have-control(prop="modelUrl",label="原型地址：")
          .control-content
            a(:href="systemData.modelUrl",target="_blank",v-if="url.model") {{systemData.modelUrl || '暂无'}}
            Input(v-else,v-model="systemData.modelUrl",type="text")
          .control-btn
            Button(type="primary",size="small",@click="inputModelUrl('model')") {{ url.model ? '填写' : '保存' }}
            upload(type="primary",size="small",@change="uploadModel") 上传
        FormItem.have-control(prop="uiUrl",label="UI地址：")
          .control-content
            a(:href="systemData.uiUrl",target="_blank",v-if="url.ui") {{systemData.uiUrl || '暂无'}}
            Input(v-else,v-model="systemData.uiUrl",type="text")
          .control-btn
            Button(type="primary",size="small",@click="inputModelUrl('ui')") {{ url.ui ? '填写' : '保存' }}
            upload(type="primary",size="small",@change="uploadUi") 上传
        FormItem.have-control(prop="webUrl",label="前端web地址：")
          .control-content
            a(:href="systemData.webUrl",target="_blank",v-if="url.web") {{systemData.webUrl || '暂无'}}
            Input(v-else,v-model="systemData.webUrl",type="text")
          .control-btn
            Button(type="primary",size="small",@click="inputModelUrl('web')") {{ url.web ? '填写' : '保存' }}
            upload(type="primary",size="small",@change="uploadWeb") 上传
      Button.clear-applicants(type="primary",size="large",@click="clearApplicants") 清空申请列表
      Transfer(:data="transferDatas",:target-keys="operators",:list-style="listStyle",filterable,:operations="['删除','同意']",@on-change="handleChange",:titles="['申请人','操作人']")
    .system-submit
        router-link(to="/system/list") 返回
        a(href="javascript:void(0);",@click="handleSubmit") 提交
        a(href="javascript:void(0);",@click="$router.push({name:'InterFaceList',params:{systemRid:systemData.rid}})") 查看接口
</template>
<script>
import { mapGetters } from 'vuex';
import axios from '@/http';
// import { Message } from 'element-ui';
import Upload from '@/views/components/Upload';

export default {
  components:{
    Upload
  },
  data () {
    const validateNewSystemName = async (rule,value,callback) => {
        if(!value) callback(new Error('请填写系统名称'));
      }
    return {
      createRules:{
        name:[
           { required: true, trigger: 'blur' ,validator: validateNewSystemName}
        ],
      },
      url:{
        model:true,
        web:true,
        ui:true,
      },
      systemData:{
        name:'',
        remarks:'',
        operatorInfos:[],
        onwerRid:'',
        applicantInfos:[],
        rid:'',
        modelUrl:'',
        uiUrl:'',
        webUrl:'',
      },
      operators:[],
      transferDatas:[],
      listStyle:{},
      systemDataCopy:{},
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  created () {
    const system = this.$route.params;
    this.initData(system); 
  },
  methods: {
    async inputModelUrl(type){
      this.url[type] = !this.url[type];
      if(this.url[type]){
        const urlType = `${type}Url`;
        const data = {id:this.systemData.id};
        data[urlType] = this.systemData[urlType];
        const ret =  await this.$axios.post('system/update',data);
        if(ret.ok){
          this.$Message.success(ret.msg);
          this.systemDataCopy[urlType] = this.systemData[urlType];
        } else {
          this.$Message.error(ret.msg);
          this.systemData[urlType] = this.systemDataCopy[urlType];
        }
      } 
    },
   
    async uploadFile(file,type){
      const data = new FormData();
      data.append('file',file);
      data.append('account',this.userInfo.account);
      data.append('type',type);
      data.append('id',this.systemData.id);
      const config = {
         headers: {'Content-Type': 'multipart/form-data'}
      }
      const ret = await this.$axios.post('system/uploadUrl',data,config);
      if(ret.ok){
        this.$Message.success(ret.msg);
        this.systemData[type] = ret.data;
        this.systemDataCopy[type] = this.systemData[type];
      } else {
        this.$Message.error(ret.msg);
      }
    },
    uploadModel(event){
      this.url.model = true;
      const e = event || window.event;
      const file = e.target.files[0];
       this.uploadFile(file,'modelUrl');
    },
    uploadUi(event){
      this.url.model = true;
      const e = event || window.event;
      const file = e.target.files[0];
      this.uploadFile(file,'uiUrl');
    },
    uploadWeb(event){
      this.url.model = true;
      const e = event || window.event;
      const file = e.target.files[0];
      this.uploadFile(file,'webUrl');
    },
    initData(system){
      this.systemData = Object.assign(this.systemData,system);
      this.systemDataCopy = Object.assign({},this.systemData);
      this.transferDatas = this.getTransferData();
      this.operators = this.getOperators();
    },
    clearApplicants(){
      this.systemData.applicantInfos = [];
      this.transferDatas = [...this.systemData.operatorInfos];
      this.$Message.success('申请人已清空');
    },
    async handleSubmit(){
      this.systemData.applicantRids = this.systemData.applicantInfos.reduce((p,c) => `${p},${c.rid}`,'').substr(1);
      this.systemData.operatorRids = this.operators.join(',');
      const system = Object.assign({},this.systemData);
      delete system.operatorInfos;
      delete system.applicantInfos;
      const ret = await this.$axios.post('/system/update',system);
      if(ret.ok){
        this.$Message.success(ret.msg);
      } else {
        this.$Message.error(ret.msg);
      }
    },
    getTransferData () {
      this.systemData.operatorInfos = this.changeUserInfo(this.systemData.operatorInfos);
      this.systemData.applicantInfos = this.changeUserInfo(this.systemData.applicantInfos || []);
      return [...this.systemData.operatorInfos,...this.systemData.applicantInfos];
    },
    changeUserInfo(infoList){
      let list = [];
      if(infoList.length > 0){
        list = infoList.map((e) => {
            e = {
              key:e.rid,
              label:e.userName,
              rid:e.rid,
            }
            if(e.rid === this.systemData.ownerRid){
              e.disabled = true;
            } else {
              e.disabled = false;
            }
            return e;
          })
      }
      return list; 
    },
    handleChange (newTargetKeys) {
      this.operators = newTargetKeys;
      this.systemData.operatorInfos = this.transferDatas.filter(u => this.operators.includes(u.key));
      this.systemData.applicantInfos = this.transferDatas.filter(u => !this.operators.includes(u.key));
    },
    getOperators () {
       return this.systemData.operatorInfos.map(e => e.key);
    },
  },
}
</script>

<style lang="scss" scoped>
.system-edite{
    .system-data{
      width: 500px;
      margin: 50px auto 0;
    }
    .system-submit{
        position: fixed;
        left: 20px;
        top: 100px;
        padding: 20px;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        a{
          width: 40px;
          height: 40px;
          margin: 5px;
          padding: 2px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #33aaff;
          border-radius: 4px;
          background: #33aaff;
          color: #ffffff;
          transition: all 0.2s ease;
          &:hover{
            background: #ffffff;
            color: #33aaff;
          }
        }
    }
    .system-data {
      background: #ffffff;
      padding: 20px;
      .ivu-transfer {
        text-align: center;
        
      }
    }
    .clear-applicants{
      margin: 20px 0 20px 10px;
    }
}
</style>
<style>
  li.ivu-transfer-list-content-item{
    text-align: left;
  }
  .have-control .ivu-form-item-content{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .have-control .ivu-form-item-content  .control-content{
      flex:1;
  }
  .have-control .ivu-form-item-content  .control-btn{
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .have-control .ivu-form-item-content  .control-btn > button{
    margin: 0 10px;
  }
</style>
