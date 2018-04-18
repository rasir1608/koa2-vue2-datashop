<template lang="pug">
  .my-system
    Form(ref="systemForm",:model="systemData",:rules="systemRules",inline,:label-width="100")
      FormItem(prop="name",label="系统名称：")
        Input(type="text",v-model="systemData.name",placeholder="系统名称")
      FormItem(prop="id",label="系统ID：")
        Input(type="text",v-model="systemData.id",placeholder="系统ID")
      FormItem(prop="ownerRid",label="系统创建人：")
        Select(v-model="systemData.ownerRid",placeholder="系统创建人",filterable,remote,clearable,:remote-method="getUserList")
          Option(v-for="(user,index) in userList",:key="index",:value="user.rid",:label="user.userName")
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
import { mapGetters, mapActions } from 'vuex';
import { Select, Option } from 'element-ui';

export default {
  components: {
    Select, Option
  },
  data(){
    const validateId = (rule,value,callback) => {
      if(value && !/^\d+$/.test(value)) callback(new Error('id必须是数字'))
      else callback()
    }
    const validateNewSystemName = async (rule,value,callback) => {
      if(!value) callback(new Error('请填写系统名称'));
    }
    const $vm = this;
    return {
      createSystemShow:false,
      newSystem:{
        name:'',
        remarks:'',
      },
      systemData:{
        name:'',
        id:'',
        ownerRid:'',
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
          title:'RID',
          key:'rid',
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
          title:'操作',
          key:'canEdite',
          width:130,
            render: (h, params) => {
              const eidtBtn = h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small'
                      },
                      on:{
                        click(){
                          $vm.$router.push({name:'SystemManage',params:params.row});
                        },
                      }
                  }, '管理');
              const delBtn = h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small'
                      },
                       on:{
                        click(){
                          $vm.delSystem(params.row);
                        },
                      }
                  }, '删除');
              const applyBtn = h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small'
                      },
                       on:{
                        click(){
                          $vm.applySystem(params.row);
                        },
                      }
                  }, '申请');
              const canOperate =  h('Button', { 
                      props: {
                          type: 'primary',
                          size: 'small'
                      },}, '申请已通过');
              if(params.row.canEdite){
                return h('div', [eidtBtn,delBtn]);
              } else if(params.row.operatorInfos.find(o => o.rid === $vm.userInfo.rid)){
                return h('div', [canOperate]);
              } else {
                return h('div', [applyBtn]);
              }
            }
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
      if(!val) {
        this.newSystem = {
          name:'',
          remarks:'',
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'userList',
      'mySystemList'
    ]),
  },
  mounted () {
    if(this.userInfo.rid) {
      this.systemData.ownerRid = this.userInfo.rid;
    }
      this.searchSystem();
  },
  methods:{
    ...mapActions([
      'getUserList',
      'getMySystemList'
    ]),
    async applySystem(row){
      const applicantInfos = row.applicantInfos;
      const applyRid = this.userInfo.rid;
      let flag = false;
      if(applicantInfos.length > 0){
        if(applicantInfos.length === 20){
          this.$Message.info('申请队列已满，请联系项目负责人进行审批后再进行申请');
        } else if(applicantInfos.find(a => a.rid === applyRid)){
          this.$Message.info('您已经在申请队列中，请联系项目负责人进行审批');
        } else {
          row.applicantRids += applyRid;
          flag = true;
        }
      } else {
        row.applicantRids = applyRid;
        flag = true;
      }
      if(flag) {
        const ret = await this.$axios.get('/system/apply',{params:{id:row.id,applicantRids:row.applicantRids}})
        if(ret.ok){
          this.$Message.success(ret.msg);
        } else {
          this.$Message.error(ret.msg);
        }
      }
    },
    async delSystem(row){
      this.$Modal.confirm({
          title: '确认删除',
          content: `<p>确认删除项目 <span style="color:red">${row.name}</span> 吗？该操作将同时删除该项目下的所有接口配置。</p>`,
          onOk: async () => {
            const ret = await this.$axios.get('/system/delete',{params:{rid:row.rid}});
            if(ret.ok){
              this.searchSystem();
              this.getMySystemList(this.userInfo.rid);
            } else {
              this.$Message.error(ret.msg);
            }
          },
          onCancel: () => {
              this.$Message.info('取消删除');
          }
      });
    },
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
          ownerRid:this.userInfo.rid,
          operatorRids:`${this.userInfo.rid}`,
        });
        if(ret.ok){
          this.searchSystem();
          this.getMySystemList(this.userInfo.rid);
        } else {
          this.$Message.error(ret.msg);
        }
      }
    },
    resetSystemData(){
      this.systemData = Object.assign(this.systemData,{
        name:'',
        id:'',
        ownerRid:'',
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
          e.ownerName = e.ownerInfo.userName;
          e.canEdite = e.ownerRid === this.userInfo.rid;
          e.operatorNames = e.operatorInfos.reduce((p,c) => {
            return `${p},${c.userName}`
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
  .el-select .el-input__inner{
    line-height: 32px;
    height: 32px;
  }
  .ivu-table-cell{
    button{
      margin: 0 3px;
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


