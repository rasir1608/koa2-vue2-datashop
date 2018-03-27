<template lang="pug">
  .my-system
    Form(ref="systemForm",:model="systemData",:rules="systemRules",inline,:label-width="100")
      FormItem(prop="name",label="系统名称：")
        Input(type="text",v-model="systemData.name",placeholder="系统名称")
      FormItem(prop="id",label="系统ID：")
        Input(type="text",v-model="systemData.id",placeholder="系统ID")
      FormItem(prop="owner",label="系统创建人：")
        Input(type="text",v-model="systemData.owner",placeholder="系统创建人")
      FormItem
        Button(type="default",@click="resetSystemData") 重置
        Button(type="primary",@click="systemData.current === 1 ? searchSystem() : systemData.current = 1") 查询
    Button(type="primary",@click="createSystemShow = true") 新建项目
    Table(:columns="columns",:data="systemList.list") 
    Page(v-if="systemList.total",:total="systemList.total",show-sizer,show-total,:current.sync="systemData.current",
    :page-size="systemData.size",@on-page-size-change="sizeChange")
    Modal(v-model="createSystemShow",title="新建系统",@on-ok="createNewSystem")
      Form(ref="newSystem",:model="newSystem",:rules="createRules",:label-width="100")
        FormItem(prop="name",label="系统名称：")
          Input(type="text",v-model="newSystem.name",placeholder="填入系统名称")
        FormItem(prop="remarks",label="系统备注：")
          Input(type="textarea",v-model="newSystem.remarks",placeholder="请填入系统备注")

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data(){
    const validateId = (rule,value,callback) => {
      if(value && !/^\d+$/.test(value)) callback(new Error('id必须是数字'))
      else callback()
    }
    const validateOwner = (rule,value,callback) => {
      if(value && !/^\d+$/.test(value)) callback(new Error('owner请填写创建人ID'))
      else callback()
    }
    const validateNewSystemName = async (rule,value,callback) => {
      if(!value) callback(new Error('请填写系统名称2'));
      else {
        // 发送ajax请求验证系统名称是否重名
      }
    }
    return {
      createSystemShow:false,
      newSystem:{
        name:'',
        remarks:'',
      },
      systemData:{
        name:'',
        id:'',
        owner:'',
        current:1,
        size:10,
      },
      createRules:{
        name:[
           { required: true, trigger: 'blur' ,validator: validateNewSystemName}
        ],
      },
      systemRules:{
        id:[
          { validator: validateId,trigger: 'blur' }
        ],
        owner:[
          { validator: validateOwner,trigger: 'blur' }
        ]
      },
      columns:[
        {
          title:"序号",
          type:'index',
          width: 60,
          align: 'center'
        },
        {
          title:'ID',
          key:'id',
        },
        {
          title:'系统名称',
          key:'name',
        },
        {
          title:'备注',
          key:'remarks',
        },
        {
          title:'负责人',
          key:'ownerName',
        },
        {
          title:'操作人',
          key:'operatorNames',
        },
        {
          title:'创建时间',
          key:'createdAt',
        },
        {
          title:'修改时间',
          key:'updatedAt',
        }
      ],
      systemList:{
        list:[],
        total:0,
      }
    }
  },
  watch:{
    'systemData.current':{
      handler(){
        this.searchSystem()
      },
      deep:true
    },
    createSystemShow(val){
      if(val) {
        this.newSystem = {
          name:'',
          remarks:'',
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
  },
  mounted () {
    if(this.userInfo.id) this.systemData.owner = this.userInfo.id;
    this.searchSystem();
  },
  methods:{
    async createNewSystem(){
        let ok = true;
        this.$refs['newSystem'].validate((valid) => {
            if (!valid) {
                this.$Message.error('查询参数不正确');
                ok = false;
            }
        })
      if(ok){
        const ret = await this.$axios.post('/system/insert',{
          ...this.newSystem,
          owner:this.userInfo.id,
          operators:`${this.userInfo.id}`,
        });
        if(ret.ok){
          this.searchSystem();
        } else {
          this.$Message.error(ret.msg);
        }
      }
    },
    resetSystemData(){
      this.systemData = Object.assign(this.systemData,{
        name:'',
        id:'',
        owner:'',
      });
      this.systemData.current === 1 ? this.searchSystem() : this.systemData.current = 1;
    },
    async searchSystem(){
      let ok = true;
      this.$refs['systemForm'].validate((valid) => {
          if (!valid) {
              this.$Message.error('查询参数不正确');
              ok = false;
          }
      })
      if(!ok) return;
      const trans = {
        current:(systemData) => {
          return {offset:(systemData.current -1) * systemData.size};
        },
        size:(systemData) => {
          return {limit:systemData.size}
        }
      };
      let params = {};
      Object.keys(this.systemData).forEach((key) => {
        const fun = trans[key];
        if(fun) params = Object.assign(params,fun(this.systemData));
        else if(this.systemData[key]) params[key] = this.systemData[key];
      });
      // axios请求数据
      const ret = await this.$axios.post('/system/page',params);
      if(ret.ok){
        let list = ret.data.list;
        list = list.map((e) => {
          e.ownerName = e.ownerInfo.user_name;
          e.operatorNames = e.operatorInfos.reduce((p,c) => {
            return `${p},${c.user_name}`
          },'');
          e.operatorNames = e.operatorNames.substr(1);
          return e;
        });
        this.systemList = {
          list,
          total:ret.data.total
        };
      } else this.$Message.error('获取列表失败');
    },
    sizeChange(size){
      this.systemData.size = size;
      this.systemData.current === 1 ? this.searchSystem() : this.systemData.current = 1;
    },
    
  }
}
</script>
<style lang="scss">
.my-system{
  padding: 20px;
  form{
    button{
      margin:0 5px;
    }
  }
  .ivu-table-wrapper{
    margin: 20px auto;
  }
  .ivu-page{
    padding: 0 20px;
    margin: 20px auto;
    text-align: right;
  }
}
</style>


