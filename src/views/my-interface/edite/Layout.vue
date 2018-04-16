<template lang="pug">
  .interface-edite
    Form.interface-form(ref="interfaceForm",:model="interface",:rules="intefaceRules",:label-width="100")
        .interface-data
            FormItem(label="接口名称：",prop="name")
                Input(v-model="interface.name",type="text",:disabled="isEdite")
            FormItem(label="接口URL：",prop="url")
                Input(v-model="interface.url",type="text")
            FormItem(label="请求方式：",prop="method")
                Select(v-model="interface.method",placeholde="请选择请求方式")
                    Option(value="GET") GET
                    Option(value="POST") POST
            FormItem(label="请求头设置：",prop="contentType")
                Select(v-model="interface.contentType",placeholde="请选择请求头")
                    Option(v-for="(item,index) in contentTypeOptions",:key='index',:value='item') {{item}}
            FormItem(label="所属项目：",prop="systemRid")
                Select(v-model="interface.systemRid",placeholde="请选择接口所属项目")
                    Option(v-for="(item,index) in systemOptions",:key='index',:value='item.rid') {{item.name}}
            FormItem(label="备注：",prop="remark")
                Input(v-model="interface.remark",type="textarea",:autosize="{minRows: 2,maxRows: 5}")
        .interface-request
            FormItem(label="请求数据：",prop="request")
                textarea(ref="interface-request")
        .interface-response
            FormItem(label="响应数据：",prop="response")
                textarea(ref="interface-response")
    .interface-submit
        router-link(to="/my-interface/list") 返回
        a(href="javascript:void(0);",@click="handleSubmit") 提交
        a(href="javascript:void(0);",@click="handleReset('interfaceForm')") 重置
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex';
import axios from '@/http';
import store from '@/store';
import { Message } from 'element-ui';

export default {
  data(){
      return {
          intefaceRules:{
              name:[
                  {required:true,message:'请填写接口名称'}
              ],
              url:[
                  {required:true,message:'请填写接口url'}
              ],
              method:[
                  {required:true,message:'请填写请求方式'}
              ],
              contentType:[
                  {required:true,message:'请选择请求头'}
              ],
              systemRid:[
                  {required:true,message:'请选择所属项目'}
              ],
              remark:[
                  {required:true,message:'请填写接口备注'}
              ]

          },
          systemOptions:[],
          contentTypeOptions:['application/x-www-form-urlencoded','multipart/form-data','application/json','text/xml'],
          interface:{
            name:'',
            url:'',
            method:'GET',
            contentType:'application/x-www-form-urlencoded',
            creatorRid:'',
            opratorRid:'',
            systemRid:'',
            request:'',
            response:'',
            remark:'',
          },
          requestEditor:'',
          responseEditor:'',
      }
  },
  computed:{
      ...mapGetters([
        'userInfo',
        'systemList',
      ]),
      isEdite(){
        return /^\d+$/.test(this.$route.params.id);
      },
  },
  async beforeRouteEnter(to, from, next){
    const id = to.params.id;
    if(id > 0) {
      const ret = await axios.get('/interface/findById',{params:{id}})
        if(ret.ok){
          const systemList = store.state.system.systemList;
          if(systemList.find(s => s.rid === ret.systemRid)){
            next(($vm) => {
              $vm.interface = ret.data;
              if($vm.requestEditor) $vm.requestEditor.setValue($vm.interface.request); 
              if($vm.responseEditor) $vm.responseEditor.setValue($vm.interface.response || '');
            });
          } else {
            Message.error('您没有编辑该接口的权限！');
            next(false);
          }
        } else {
            Message.error('可用项目获取失败！');
            next(false);
        } 
    } else {
      next();
    }
  },
  async created(){
    this.getUseableSystem();
    
  },
  
  async mounted(){
    if(!this.requestEditor) this.requestEditor = this.startCodeMirror('interface-request',this.interface.request);
    if(!this.responseEditor) this.responseEditor = this.startCodeMirror('interface-response',this.interface.response);
  },
  methods:{
    async getEditeInterface(id){
        const ret = await this.$axios.get('/interface/findById',{params:{id}})
        if(ret.ok){
            this.interface = ret.data;
            if(this.requestEditor) this.requestEditor.setValue(this.interface.request); 
            if(this.responseEditor) this.responseEditor.setValue(this.interface.response || '');
        } else {
            this.$Message.error(ret.msg);
        }
    },
    getUseableSystem(){
      if(this.systemList.length){
        this.systemOptions = this.systemList.map(e => ({rid:e.rid,name:e.name}))
      } else {
        this.$Modal.info({
            title: '提示',
            content: '没有可用的项目，请先到项目列表页面申请，或者新建项目',
            onOk:() => {
              this.$router.push('/');
            }
        });
      }
    },
    async handleSubmit(){
        let ok;
        this.$refs['interfaceForm'].validate((valid) => {
            ok = valid;
        })
        if(ok){
            const request = this.requestEditor.getValue();
            const response = this.responseEditor.getValue();
            this.interface.request = request;
            this.interface.response = response;
            this.interface.opratorRid = this.userInfo.rid;
            if(this.$route.params.id > 0 ) {
              this.interface.id = this.$route.params.id;
                this.updateInterface();
            } else {
                this.interface.creatorRid = this.userInfo.rid;
                this.createInterface();
            }
        } else {
            this.$Message.error('参数填写有误，请仔细检查！');
        }
    },
    async updateInterface(){
        this.interface.oprator = this.userInfo.id;
        const ret = await this.$axios.post('/interface/update',this.interface);
        if(ret.ok){
            this.$Message.success('接口更新成功！');
            this.$router.push('/my-interface/list');
        } else {
            this.$Message.error(ret.msg || '接口更新失败！');
        }
    },
    async createInterface(){
        const ret = await this.$axios.post('/interface/insert',this.interface);
        if(ret.ok){
            this.$Message.success('接口创建成功！');
            this.$router.push('/my-interface/list');
        } else {
            this.$Message.error(ret.msg || '接口创建失败！');
        }
    },
    async handleReset (name) {
        const id = this.$route.params.id;
        if(id > 0) await this.getEditeInterface(id);
        else {
          this.$refs[name].resetFields();
          this.requestEditor.setValue('');
          this.responseEditor.setValue('');
        }
    },
    startCodeMirror(name,initValue){
        const editor = window.CodeMirror.fromTextArea(this.$refs[name], {
            mode:'application/json',
            lineNumbers:true,
            theme:'default',
            lineWrapping:true,
            foldGutter:true,
            indentUnit:4
        });
        if(initValue) editor.setValue(initValue);
        return editor;
    },
  }
}
</script>
<style lang="scss">
 .interface-edite{
    padding: 20px;
     .interface-data{
        width:500px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 4px;
     }
    .interface-request,.interface-response{
        width:500px;
        margin: 0 auto;
        .CodeMirror{
            border: 1px solid #bbb;
            height: 200px;
        }
        .ivu-form-item-content{
            line-height: 18px;
        }
    }
     .interface-submit{
        position: fixed;
        left: 20px;
        top: 100px;
        padding: 20px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
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
