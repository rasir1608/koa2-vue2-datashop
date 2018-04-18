<template lang="pug">
  .system-edite
    .system-data
      Form(ref="systemData",:model="systemData",:rules="createRules",:label-width="100")
        FormItem(prop="name",label="系统名称：")
          div {{systemData.name}}
        FormItem(prop="remarks",label="系统备注：")
          Input(type="textarea",v-model="systemData.remarks",placeholder="请填入系统备注")
      Button.clear-applicants(type="primary",size="large",@click="clearApplicants") 清除申请列表
      Transfer(:data="transferDatas",:target-keys="operators",:list-style="listStyle",filterable,:operations="['删除','同意']",@on-change="handleChange",:titles="['申请人','操作人']")
    .system-submit
        router-link(to="/system/list") 返回
        a(href="javascript:void(0);",@click="handleSubmit") 提交
</template>
<script>
import { mapGetters } from 'vuex';
import axios from '@/http';
import { Message } from 'element-ui';

export default {
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
      systemData:{
        name:'',
        remarks:'',
        operatorInfos:[],
        onwerRid:'',
        applicantInfos:[],
      },
      operators:[],
      transferDatas:[],
      listStyle:{},
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  created () {
    const system = this.$route.params;
    this.systemData = Object.assign(this.systemData,system);
    this.transferDatas = this.getTransferData();
    this.operators = this.getOperators();
  },
  methods: {
    clearApplicants(){
      this.systemData.applicantInfos = [];
      this.transferDatas = [...this.systemData.operatorInfos];
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
</style>
