<template>
  <li :class="['rview-scroll-list-item',activeValue === item.value? 'is-active':'']" ref="rview-scroll-list-item" @click="sendValue">
      <slot :item="item" :value="item.value" :label="item.label"></slot>
      <span>{{activeValue === item.value}}/{{item.value}}/{{activeValue}}</span>
  </li>
</template>
<script>
export default {
  props:{
    item:{
      type:Object,
      default(){
        return {}
      }
    },
    value:null,
    label:null,
    activeValue:null,
  },
  data(){
    return {
      isActive:false,
      selectValue:'',
    }
  },
  watch:{
  },
  created(){
  },
  methods:{
    sendValue(){
      this.bus.$emit('rview-select-change',this.item)
    },
  }
}
</script>

