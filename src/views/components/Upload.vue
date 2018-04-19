<template lang="pug">
  .upload-btn-module
    Button(:type="type || 'primary'",:size="size || 'small'")
      slot 上传
    input(type="file",@change="$emit('change')")
</template>
<script>
export default {
  props:['type','size'],
}
</script>
<style lang="scss" scoped>
.upload-btn-module{
  overflow: hidden;
  position: relative;
  display: inline-block;
  button{margin: 0;display: block;}
  input{
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: pointer;
    width: 500%;
    height: 500%;
    z-index: 2;
    opacity: 0;
  }
}
</style>
