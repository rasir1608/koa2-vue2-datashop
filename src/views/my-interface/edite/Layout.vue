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
            FormItem(label="所属项目：",prop="systemId")
                Select(v-model="interface.systemId",placeholde="请选择接口所属项目")
                    Option(v-for="(item,index) in systemOptions",:key='index',:value='item.id') {{item.name}}
            FormItem(label="备注：",prop="remark")
                Input(v-model="interface.remark",type="textarea",:autosize="{minRows: 2,maxRows: 5}")
        .interface-request
            FormItem(label="请求数据：",prop="request")
                textarea(ref="interface-request")
        .interface-response
            FormItem(label="响应数据：",prop="response")
                textarea(ref="interface-response")
            
    .interface-submit
        Button(type="primary",@click="handleSubmit") 提交
        Button(type="ghost",@click="handleReset('interfaceForm')",style="margin-left:10px") 重置
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex';

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
              systemId:[
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
            creator:'',
            oprator:'',
            systemId:'',
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
          'userInfo'
      ]),
      isEdite(){
        return /^\d+$/.test(this.$route.params.id);
      },
  },
  async created(){
    this.getUseableSystem();
      const id = this.$route.params.id;
      if(id > 0) await this.getEditeInterface(id);
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
            this.$Message.error('可用项目获取失败！');
        }
    },
    async getUseableSystem(){
        const ret = await this.$axios.get('/system/mySystems',{params:{userId:this.userInfo.id}})
        if(ret.ok){
            this.systemOptions = ret.data.map(e => ({id:e.id,name:e.name}))
        } else {
            this.$Message.error('可用项目获取失败！');
        }
    },
    async handleSubmit(){
        let ok;
        this.$refs['interfaceForm'].validate((valid) => {
            ok = valid;
        })
        const request = this.requestEditor.getValue();
        const response = this.responseEditor.getValue();
        if((!request || utils.isJsonString(request)) && ( !response || utils.isJsonString(response)) && ok){
            this.interface.request = request;
            this.interface.response = response;
            this.interface.creator = this.userInfo.id;
            this.interface.oprator = this.userInfo.id;
            if(this.$route.params.id >0 ) {
                this.interface.id = this.$route.params.id;
                this.updateInterface();
            } else {
                this.createInterface();
            }
            // ajax请求
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
    handleReset (name) {
        this.$refs[name].resetFields();
        this.requestEditor.setValue('');
        this.responseEditor.setValue('');
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
         padding: 20px;
         text-align: center;
     }
 }
</style>
