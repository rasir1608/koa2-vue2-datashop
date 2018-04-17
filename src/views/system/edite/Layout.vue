<template lang="pug">
  .system-edite
    .system-data
      Form(ref="systemData",:model="systemData",:rules="createRules",:label-width="100")
        FormItem(prop="name",label="系统名称：")
          Input(type="text",v-model="systemData.name",placeholder="填入系统名称")
        FormItem(prop="remarks",label="系统备注：")
          Input(type="textarea",v-model="systemData.remarks",placeholder="请填入系统备注")
      //- Button(type="primary",size="small",@click="clear") 清除申请列表
      Transfer(:data="userInfos",:target-keys="operators",:list-style="listStyle",filterable,:render-format="render",:operations="['删除','同意']",@on-change="handleChange",:titles="['申请人','操作人']")
    .system-submit
        router-link(to="/system/list") 返回
        a(href="javascript:void(0);",@click="handleSubmit") 提交
        a(href="javascript:void(0);",@click="handleReset('interfaceForm')") 重置
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
      userInfos:[],
      listStyle:{},
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'userList'
    ]),
  },
  created () {
    
  },
  methods: {
    clear(){
      this.systemData.applicantInfos = [];
      this.userInfos = [...this.systemData.operatorInfos];
    },
    handleSubmit(){},
    handleReset(name){
      console.log(name)
    },
    getTransferData () {
      this.systemData.operatorInfos = this.changeUserInfo(this.systemData.operatorInfos);
      this.systemData.applicantInfos = this.changeUserInfo(this.systemData.applicantInfos || []);
      console.log(this.systemData)
      return [...this.systemData.operatorInfos,...this.systemData.applicantInfos];
    },
    changeUserInfo(infoList){
      let list = [];
      if(infoList.length > 0){
        list = infoList.map((e) => {
            e = {
              key:e.rid,
              label:e.userName,
            }
            if(e.rid === this.systemData.onwerRid){
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
      console.log(86,newTargetKeys)
      this.operators = newTargetKeys;
      this.systemData.operatorInfos = this.userInfos.filter(u => this.operators.includes(u.key));
      this.systemData.applicantInfos = this.userInfos.filter(u => !this.operators.includes(u.key));
    },
    getOperators () {
       return this.systemData.operatorInfos.map(e => e.key);
    },
    render (item) {
        return item.label;
    },
  },
  async beforeRouteEnter(to, from, next){
    const id = to.params.id;
    if(id > 0){
      const ret = await axios.get('/system/findById',{params:{id}});
      if(ret.ok){
        const systemData = ret.data;
        next(($vm) => {
          console.log(103,systemData)
          $vm.systemData = Object.assign($vm.systemData,systemData);
          console.log(104,$vm.systemData)
          $vm.userInfos = $vm.getTransferData();
          $vm.operators = $vm.getOperators();
          console.log(107,$vm.userInfos)
        });
      } else {
        Message.error(ret.msg);
        next(false);
      }
    } else {
      next(($vm) => {
        // $vm.systemData={
        //     name:'',
        //     remarks:'',
        //     operatorInfos:[$vm.userInfo],
        //     onwerRid:$vm.userInfo.rid,
        //     applicantInfos:[],
        //   }
        $vm.userInfos = $vm.getTransferData();
        // $vm.operators = $vm.getOperators();
      })
    }
  }
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
}
</style>
