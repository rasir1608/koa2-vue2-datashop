<template lang="pug">
  .logout
    i-circle(:percent="percent")
        span 注销中，请稍后
        br
        span(class="demo-Circle-inner",style="font-size:24px") {{percent}}%
    Modal(v-model='massageShow', width='360')
      p(slot='header', style='color:#f60;text-align:center')
        Icon(type='information-circled')
        span 注销成功
      div(style='text-align:center')
        p 账号注销成功
        p 跳转到登陆页面
      div(slot='footer')
        Button(type='success', size='large', long, @click='logout') 确定

</template>
<script>
export default {
  data(){
    return{
      percent:0,
      massageShow:false,
    }
  },
  mounted(){
    this.$store.commit('LOGOUT');
    const timer = setInterval(() => {
      this.percent += 2;
      if(this.percent === 100) {
        clearInterval(timer);
        this.massageShow = true;
      };
    },100)
  },
  methods: {
    logout(){
      this.$router.push("/user/login");
    },
  }
}
</script>
<style lang="scss">
  .logout{
    width: 80%;
    margin: 50px auto;
    text-align: center;
  }
</style>

