<template>
    <div class="rview-scroll-list">
        <input class="rview-scroll-list-innerinput" type="text" v-model="rsvalue" @keyup="getKeyControll" @focus="showList" @blur="hideList"/>
        <div class="rview-scroll-list-options" ref="rview-scroll-list-options"  v-if="listShow">
            <ul class="rview-scroll-list-items" ref="rview-scroll-list-items">
                <slot  v-for="(item,i) in list" :item="item" :active-value="activeValue">{{i}}</slot>
            </ul>
            <div class="rview-scroll-list-no-data" v-if="!totalList.length">
                暂无数据
            </div>
            <div class="rview-scroll-list-slider" ref="rview-scroll-list-slider">
                <span class="rview-scroll-list-slider-block" ref="rview-scroll-list-slider-block"></span>
            </div>
        </div>
    </div>
</template>
<script>
/* 数据复现  */ 
/* 数据复现  */ 
export default {
  props:{
      listSize:{
          type:Number,
          default(){
              return 10;
          },
      },
      totalList:{
          type:Array,
          default(){
              return [];
          },
      },
      total:{
          type:Number,
          default(){
              return 100;
          },
      },
      value:null,
      filterable:Boolean,
  },
  data(){
     return {
         rsvalue:'',
         index:0,
         attachBottomTime:0,
         attachTopTime:0,
         speed:15,
         activeValue:'',
         filterList:[],
         listShow:false,
         clientY:0,
     }
  },
  watch:{
      index(val){
         if(this.listShow) this.$nextTick(() => {
             this.$refs['rview-scroll-list-options'].scrollTop = 0
         });
      },
      value(val){
        this.getLabel(val);
      },
      filterList(filterList){
        if(!this.listShow) return;
        this.$nextTick(() => {
            const slider = this.$refs['rview-scroll-list-slider'];
            const block = this.$refs['rview-scroll-list-slider-block'];
            if(filterList.length) block.style.height = `${Math.max(Math.floor(slider.offsetHeight / filterList.length),20)}px`;
        })
      },
     listShow(val){
         this.filterList = this.totalList;
         if(val) {
             this.$nextTick(() => {
                 this.setInitEvent();
                if(this.value) this.getLabel(this.value);
            });
         } 
     },
  },
  computed:{
      list(){
          return this.filterList.slice(this.index,Math.min((this.index+1) + this.listSize,this.totalList.length));
      },
  },
  created(){
        this.filterList = this.totalList;
        this.bus.$on('rview-select-change',this.getOption);
  },
  mounted(){
        if(this.value) this.getLabel(this.value);
        this.$watch('rsvalue',(val) => {
            if(this.filterable) this.filterList = this.totalList.filter(item => `${item.label}`.indexOf(val) !== -1);
            else this.filterList = this.totalList;
            this.index = 0;
            if(this.filterList.length) this.activeValue = this.filterList[this.index].value;
        });
  }, 
  methods:{
        hideList(){
            setTimeout(() => {
                this.listShow = false;
            },200);
        },
        showList(event){
            event = event || window.event;
            console.log(event)
            this.clientY = event.clientY;
            this.listShow = true;
        },
        getKeyControll(evnet){
            event = event || window.event;
            if(evnet.keyCode === 40){
                this.index = Math.min(this.filterList.length-1,this.index + 1);
            } else if( evnet.keyCode === 38){
                this.index = Math.max(0,this.index - 1);
            } else if(event.keyCode === 13){
                this.getOption(this.filterList[this.index]);
            } else return;
            this.activeValue = this.filterList[this.index].value;
        },
        getLabel(value){
            const index = this.filterList.findIndex(item => item.value === value);
            this.index = Math.max(index,0);
            if(this.filterList.length) this.rsvalue = this.filterList[this.index].label;
            this.activeValue = value;
        },
        getOption(item){
            if(this.rsvalue !== item.label)this.rsvalue = item.label;
            if(this.vaule !== item.value){
                this.$emit('input',item.value);
            };
        },
        setInitEvent(){
            const self = this;
            const optionsNode = this.$refs['rview-scroll-list-options'];
            const ulNode = this.$refs['rview-scroll-list-items'];
            const slider = this.$refs['rview-scroll-list-slider'];
            const block = this.$refs['rview-scroll-list-slider-block'];
            const bodyHeight = document.body.offsetHeight;
            console.log(bodyHeight,this.clientY)
            if(bodyHeight - this.clientY < 240){
                optionsNode.style.top = '-240px';
            }
            block.style.height = `${Math.max(Math.floor(slider.offsetHeight / this.filterList.length),20)}px`;
            function stopBodyWheel(event){
                if(event.path.some(node => node.className === 'rview-scroll-list-items')) return false;
            }
            function resetSliderPos(){
                block.style.top = `${(slider.offsetHeight/self.filterList.length)*self.index}px`
                slider.style.top = `${optionsNode.scrollTop}px`;
            };
            if(!document.body.onmousewheel || document.body.onmousewheel.name !== 'stopBodyWheel') {
                document.body.onmousewheel = stopBodyWheel;
            }
            this.addMouseWheelEvent(optionsNode,function(event){
                let wheelDir = true;
                //   向下为true,向上为false;
                if(event.wheelDelta) wheelDir = event.wheelDelta < 0;
                else if(event.detail) wheelDir = event.detail > 0;
                if(wheelDir){
                    optionsNode.scrollTop += self.speed;
                    if(optionsNode.scrollTop >= ulNode.getElementsByTagName('li')[0].offsetHeight){
                        optionsNode.scrollTop = 0;
                        self.index += 1;
                    } else if(optionsNode.scrollTop >= ulNode.offsetHeight - optionsNode.offsetHeight){
                        optionsNode.scrollTop = ulNode.offsetHeight - optionsNode.offsetHeight;
                        if(Date.now() - self.attachBottomTime > 300){
                            console.log('到底了',Date.now() - self.attachBottomTime)
                        }
                        self.attachBottomTime = Date.now();
                    }
                    resetSliderPos();
                } else {
                    optionsNode.scrollTop -= self.speed;
                    resetSliderPos();
                    if(self.index > 0){
                        if(optionsNode.scrollTop <= 0){
                            self.index -= 1;
                            self.$nextTick(() =>{
                                optionsNode.scrollTop = ulNode.getElementsByTagName('li')[0].offsetHeight;
                                resetSliderPos();
                            });
                        }
                    } else if(optionsNode.scrollTop <= 0 ){
                        if(Date.now() - self.attachTopTime > 300){
                            console.log('到顶了',Date.now() - self.attachTopTime)
                        }
                        self.attachTopTime = Date.now();
                    }
                }
            });
            // 给滑块绑定拖拽事件
            this.addEvent(block,'mousedown',function(de){
                de = de || window.event;
                let top = parseInt(block.style.top || 0);
                let clientY = de.clientY;
                block.style.transition = 'unset';
                function blockMove (me){
                    const offsetY = me.clientY - clientY;
                    const cTop = top + offsetY;
                    const index = Math.floor(cTop / (slider.offsetHeight/self.filterList.length));
                    if(offsetY > 0 ) {
                        if( ulNode.offsetHeight - ulNode.getElementsByTagName('li')[0].offsetHeight <= optionsNode.offsetHeight) return;
                        self.index = Math.min(index,self.filterList.length);
                    } else {
                        self.index = Math.max(index,0);
                    };
                    block.style.top = `${cTop}px`; 
                    optionsNode.scrollTop = 0;
                    slider.style.top = 0;
                }
                function removeMove(){
                    self.removeEvent(block,'mousemove',blockMove);
                    block.style.transition = 'top 0.2s ease';
                }
                self.addEvent(block,'mousemove',blockMove)
                self.addEvent(block,'mouseup',removeMove)
                self.addEvent(block,'mouseout',removeMove)

            });
        },
        addMouseWheelEvent(element,func) {
            if (typeof element.onmousewheel == "object") {
                this.addEvent(element,"mousewheel",func)
            }
        
            if (typeof element.onmousewheel == "undefined") {
               this.addEvent(element,"DOMMouseScroll",func,false);
            } 
        },
        removeMouseWheelEvent(element,func){
             if (typeof element.onmousewheel == "object") {
                this.removeEvent(element,"mousewheel",func)
            }
        
            if (typeof element.onmousewheel == "undefined") {
               this.removeEvent(element,"DOMMouseScroll",func,false);
            } 
        },
        addEvent(element,type,func,flag){
            if(element.addEventListener) element.addEventListener(type,func,Boolean(flag));
            else element.attachEvent(`on${type}`,func);
        },
        removeEvent(element,type,func,flag){
            if(element.removeEventListener) element.removeEventListener(type,func,Boolean(flag));
            else element.detachEvent(`on${type}`,func);
        }
  }
}
</script>
<style scoped>
    .rview-scroll-list{
        display: inline-block;
        line-height: 36px;
        height: 38px;
        box-sizing: border-box;
        text-align: left;
        position: relative;
    }
    .rview-scroll-list *{
         box-sizing: border-box;
         margin: 0;
         padding: 0;
    }
    .rview-scroll-list .rview-scroll-list-innerinput{
         width: 100%;
         line-height: 36px;
         height: 36px;
         border-radius: 4px;
         border: 1px solid #cccccc;
         outline: 0;
         padding: 5px 10px;
    }
    .rview-scroll-list .rview-scroll-list-innerinput:hover{
        border-color: #999999;
    }
    .rview-scroll-list .rview-scroll-list-innerinput:focus{
        border-color: #33aaff;
    }
    .rview-scroll-list .rview-scroll-list-options{
        width: 100%;
        border: 1px solid #cccccc;
        border-radius: 4px;
        margin-top:1px; 
        max-height: 200px;
        overflow: hidden;
        position: absolute;
        z-index: 99;
    }
    .rview-scroll-list ul.rview-scroll-list-items{
        list-style: none;
    
    }
    .rview-scroll-list ul.rview-scroll-list-items li.rview-scroll-list-item{
        list-style: none;
        line-height: 1.5;
        background: #ffffff;
        padding: 5px 10px;
    }
    .rview-scroll-list ul.rview-scroll-list-items li.rview-scroll-list-item:hover{
        background: #eeeeee;
    }
    .rview-scroll-list ul.rview-scroll-list-items li.rview-scroll-list-item.is-active{
        background: #409EFF;
        color: #ffffff;
    }
    .rview-scroll-list .rview-scroll-list-options .rview-scroll-list-no-data{
        text-align: center;
        background: #ffffff;
    }
    .rview-scroll-list .rview-scroll-list-options .rview-scroll-list-no-data:hover{
        background: #eeeeee;
    }
    .rview-scroll-list .rview-scroll-list-options:hover .rview-scroll-list-slider{
        opacity: 0.5;
    }
    .rview-scroll-list .rview-scroll-list-options .rview-scroll-list-slider{
        position: absolute;
        width: 7px;
        background: #cccccc;
        top:0;
        right: 2px;
        height: 100%;
        border-radius: 3px;
        transition: opacity 1s ease;
        z-index: 2;
        opacity: 0;
    }
     .rview-scroll-list .rview-scroll-list-options .rview-scroll-list-slider .rview-scroll-list-slider-block{
         width: 5px;
         height: 10px;
         position: absolute;
         left: 1px;
         top: 0;
         display: inline-block;
         background: #000000;
         transition: top 0.2s ease;
     }
</style>
