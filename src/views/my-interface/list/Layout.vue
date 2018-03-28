<template lang="pug">
  .interface-list
    Form(ref="systemForm",:model="interfaceData",inline,:label-width="100")
      FormItem(prop="name",label="接口名称：")
        Input(type="text",v-model="interfaceData.name",placeholder="接口名称")
      FormItem(prop="id",label="接口ID：")
        Input(type="text",v-model="interfaceData.id",placeholder="接口ID")
      FormItem(prop="creator",label="接口创建人：")
        Input(type="text",v-model="interfaceData.creator",placeholder="接口创建人")
      FormItem(prop="method",label="请求方式：")
        Input(type="text",v-model="interfaceData.method",placeholder="请求方式")
      FormItem(prop="contentType",label="请求头：")
        Input(type="text",v-model="interfaceData.contentType",placeholder="contentType")
      FormItem
        Button(type="default",@click="resetInterfaceData") 重置
        Button(type="primary",@click="interfaceData.current === 1 ? searchInterface() : interfaceData.current = 1") 查询
    Button(type="primary",@click="$router.push('/my-interface/edite/-1')") 添加接口
    Table(:columns="interfaceColumns",:data="interfaceList.list") 
    Page(v-if="interfaceList.total",:total="interfaceList.total",show-sizer,show-total,:current.sync="interfaceData.current",
    :page-size="interfaceData.size",@on-page-size-change="sizeChange")
   
</template>
<script>
export default {
  data(){
      return{
          interfaceRules:{

          },
          interfaceData:{
                id:'',
                name:'',
                url:'',
                method:'',
                contentType:'',
                creator:'',
                oprator:'',
                systemId:'',
                size:10,
                current:1,
          },
          interfaceColumns:[
              {
                  title:'接口ID',
                  key:'id'
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
                                  this.$router.push(`/my-interface/edite/${params.row.id}`);
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
                  title:'创建者',
                  key:'creatorName'
              },{
                  title:'修改者',
                  key:'opratorName'
              },{
                  title:'所属系统',
                  key:'systemName'
              },{
                  title:'创建时间',
                  key:'createdAt'
              }
          ],
          interfaceList:{
               list:[],
               totoal:0,
          },
      }
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
      this.searchInterface();
  },
  methods:{
      resetInterfaceData(){

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
                list:ret.data.list,
                total:ret.data.total
            }
        } else {
            this.$Message.error(ret.msg || '获取接口分页信息失败！');
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
