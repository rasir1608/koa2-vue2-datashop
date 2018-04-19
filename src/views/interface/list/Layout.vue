<template lang="pug">
  .interface-list
    Form(ref="systemForm",:model="interfaceData",inline,:label-width="100")
      FormItem(prop="name",label="接口名称：")
        Input(type="text",v-model="interfaceData.name",placeholder="接口名称")
      FormItem(prop="rid",label="接口RID：")
        Input(type="text",v-model="interfaceData.rid",placeholder="接口RID")
      FormItem(prop="system",label="所属项目：")
        Select(v-model="interfaceData.systemRid",placeholder="所属项目",filterable,clearable)
          Option(v-for="(user,index) in mySystemList",:key="index",:value="user.rid",:label="user.name")
      FormItem(prop="creator",label="接口创建人：")
        Select(v-model="interfaceData.creatorRid",placeholder="接口创建人",filterable,remote,clearable,:remote-method="getUserList")
          Option(v-for="(user,index) in userList",:key="index",:value="user.rid",:label="user.userName")
      FormItem(prop="method",label="请求方式：")
        Select(v-model="interfaceData.method",placeholder="请求方式",clearable)
          Option(value="GET",label="GET")
          Option(value="POST",label="POST")
      FormItem(prop="contentType",label="请求头：")
        Select(v-model="interfaceData.contentType",placeholder="contentType",clearable)
          Option(v-for="(item,index) in contentTypeOptions",:key="index",:value="item",:label="item")
      FormItem
        Button(type="default",@click="resetInterfaceData") 重置
        Button(type="primary",@click="interfaceData.current === 1 ? searchInterface() : interfaceData.current = 1") 查询
    Button(type="primary",@click="$router.push('/interface/edite/-1')") 添加接口
    Table(:columns="interfaceColumns",:data="interfaceList.list") 
    Page(v-if="interfaceList.total",:total="interfaceList.total",show-sizer,show-total,:current.sync="interfaceData.current",
    :page-size="interfaceData.size",@on-page-size-change="sizeChange")
   
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { Select, Option } from 'element-ui';

export default {
  components: {
    Select, Option
  },
  data(){
      const $vm = this;
      return{
          contentTypeOptions:['application/x-www-form-urlencoded','multipart/form-data','application/json','text/xml'],
          interfaceRules:{

          },
          interfaceData:{
                rid:'',
                name:'',
                url:'',
                method:'',
                contentType:'',
                creatorRid:'',
                systemRid:'',
                size:10,
                current:1,
          },
          interfaceColumns:[
              {
                  title:'接口RID',
                  key:'rid',
                  render:(h,params) => {
                      return h('a',{
                          props:{
                              href:'javascript:void(0);'
                          },
                          on:{
                              click:() => {
                                  this.$router.push(`/interface/edite/${params.row.id}`);
                              },
                          }
                      },params.row.rid)
                  }
              },{
                  title:'接口名称',
                  key:'name',
                  render:(h,params) => {
                      return h('a',{
                          props:{
                              href:'javascript:void(0);'
                          },
                          on:{
                              click:() => {
                                  this.$router.push(`/interface/edite/${params.row.id}`);
                              },
                          }
                      },params.row.name)
                  }
              },{
                  title:'接口URL',
                  key:'url'
              },{
                  title:'请求方式',
                  key:'method'
              },{
                  title:'请求头',
                  key:'contentType'
              },{
                  title:'备注',
                  key:'remark'
              },{
                  title:'创建者',
                  key:'creatorName'
              },{
                  title:'修改者',
                  key:'opratorName'
              },{
                  title:'所属项目',
                  key:'systemName'
              },{
                  title:'操作',
                  key:'canEdite',
                  render:(h,params) => {
                    const delBtn = h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                          on:{
                          click(){
                            $vm.deleteInterface(params.row);
                          },
                        }
                    }, '删除');
                      return params.row.canEdite ? h('div',[delBtn]) :'';
                  }
              }
          ],
          interfaceList:{
               list:[],
               totoal:0,
          },
      }
  },
   computed: {
    ...mapGetters([
      'userInfo',
      'userList',
      'mySystemList',
    ]),
  },
  watch:{
    'interfaceData.current':{
        handler(){
            this.searchInterface()
        },
        deep:true
    },
  },
  created(){
    const systemRid = this.$route.params.systemRid;
    if(systemRid) this.interfaceData.systemRid = systemRid;
    else if(this.userInfo.rid) {
      this.interfaceData.creatorRid = this.userInfo.rid;
    }
    this.searchInterface();
  },
  methods:{
      ...mapActions([
        'getUserList',
      ]),
      resetInterfaceData(){
        this.interfaceData = {
                rid:'',
                name:'',
                url:'',
                method:'',
                contentType:'',
                creatorRid:this.userInfo.rid,
                systemRid:'',
                size:10,
                current:1,
          }
      },
      deleteInterface(row){
         this.$Modal.confirm({
          title: '确认删除',
          content: `<p>确认删除接口 <span style="color:red">${row.name}</span> 吗？该操作不可逆！。</p>`,
          onOk: async () => {
            const ret = await this.$axios.get('/interface/deleteByRid',{params:{rid:row.rid}})
            if(ret.ok) {
              this.$Message.success(ret.msg)
              this.searchInterface();
            } else {
              this.$Message.error(ret.msg)
            }
          },
          onCancel: () => {
              this.$Message.info('取消删除');
          }
      });
      },
      async searchInterface(){
        const trans = {
            current:(interfaceData) => {
            return {offset:(interfaceData.current -1) * interfaceData.size};
            },
            size:(interfaceData) => {
            return {limit:interfaceData.size}
            }
        };
        let params = {};
        Object.keys(this.interfaceData).forEach((key) => {
            const fun = trans[key];
            if(fun) params = Object.assign(params,fun(this.interfaceData));
            else if(this.interfaceData[key]) params[key] = this.interfaceData[key];
        });
        const ret = await this.$axios.post('/interface/page',params);
        if(ret.ok){
            this.interfaceList = {
                list:ret.data.list.map(i => {
                  i.canEdite = Boolean(this.mySystemList.find(s => s.rid === i.systemRid));
                  return i;
                }),
                total:ret.data.total
            }
        } else {
            this.$Message.error(ret.msg || '获取接口分页信息失败！');
             this.interfaceList = {
                list:[],
                total:0
            }
        }
        // axios请求数据
      },
      sizeChange(){
          
      },
     
  },
}
</script>

<style lang="scss">
.interface-list{
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
