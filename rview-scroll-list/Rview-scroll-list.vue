<template>
    <div class="rview-scroll-list">
        <input class="rview-scroll-list-innerinput" type="text" v-model="rsvalue" />
        <div class="rview-scroll-list-options" ref="rview-scroll-list-options">
            <ul class="rview-scroll-list-items" ref="rview-scroll-list-items-a">
                <li class="rview-scroll-list-item"  v-for="i in listA" :key="i" ref="rview-scroll-list-item-a">
                    {{i}}
                </li>
            </ul>
            <ul class="rview-scroll-list-items" ref="rview-scroll-list-items-b">
                <li class="rview-scroll-list-item" v-for="i in listB" :key="i" ref="rview-scroll-list-items-b">
                    {{i}}
                </li>
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

export default {
  props:{
      listSize:{
          type:Number,
          default(){
              return 2;
          },
      },
      label:String,
      value:String,
      total:{
          type:Number,
          default(){
              return 100;
          },
      }
  },
  data(){
     return {
         rsvalue:'',
         page:0,
         totalList:[],
         attachBottomTime:0,
         attachTopTime:0,
     }
  },
  watch:{
      page(val){
          console.log(50,val)
      },
  },
  computed:{
      listA(){
          return this.totalList.slice(this.page*this.listSize,Math.min((this.page+1)*this.listSize,this.totalList.length));
      },
      listB(){
          const totalPage = this.totalPage;
          if(this.page + 1 > totalPage) return [];
          else if(this.page + 1 === totalPage) return this.totalList.slice((this.page+1)* this.listSize,this.totalList.length);
          else if(this.page + 1 < totalPage) return this.totalList.slice((this.page + 1)* this.listSize , (this.page + 2) * this.listSize );
      },
      totalPage(){
          return Math.floor(this.totalList.length / this.listSize);
      },
  },
  mounted(){
        for (let index = 0; index < 35; index++) {
            this.totalList.push(index)
        }
        const self = this;
        const optionsNode = this.$refs['rview-scroll-list-options'];
        const ulANode = this.$refs['rview-scroll-list-items-a'];
        const ulBNode = this.$refs['rview-scroll-list-items-b'];
        const slider = this.$refs['rview-scroll-list-slider'];
        const block = this.$refs['rview-scroll-list-slider-block'];
        block.style.height = `${Math.max(Math.floor(slider.offsetHeight / this.totalList.length),20)}px`;
        function bodyStopWheel(event){
            if(event.target.className === 'rview-scroll-list-item' ) return false;
        }
      if(!document.body.onmousewheel || document.body.onmousewheel.name !== 'bodyStopWheel') {
          document.body.onmousewheel = bodyStopWheel;
      }
      this.addMouseWheelEvent(optionsNode,function(event){
          let wheelDir = true;
        //   向下为true,向上为false;
          if(event.wheelDelta) wheelDir = event.wheelDelta < 0;
          else if(event.detail) wheelDir = event.detail > 0;
          const ulALis = ulANode.getElementsByTagName('li');
          const ulBLis = ulBNode.getElementsByTagName('li');
          const ulALisHeights = [];
         for (let i = 0; i < ulALis.length; i++) {
            const height = ulALis[i].offsetHeight;
            if(i > 0) ulALisHeights.push(height + ulALisHeights[i-1]);
            else ulALisHeights.push(height);
         }
        let index = ulALisHeights.findIndex(height => height >= optionsNode.scrollTop);
          if(wheelDir){
              optionsNode.scrollTop += 10;
            if(self.page === self.totalPage){
                if(optionsNode.scrollTop === ulANode.offsetHeight - optionsNode.offsetHeight && Date.now() - self.attachBottomTime  > 3000){
                    console.log('到底部了')
                    self.attachBottomTime = Date.now();
                } else {
                    optionsNode.scrollTop = Math.min(optionsNode.scrollTop,ulANode.offsetHeight - optionsNode.offsetHeight);
                }
            } else if(self.page < self.totalPage){
                if(index === ulALis.length-1){
                    if(optionsNode.scrollTop >= ulANode.offsetHeight){
                        self.page += 1;
                        optionsNode.scrollTop = 0;
                    }
                }
                resetSliderPos();
            }
            slider.style.top = `${optionsNode.scrollTop}px`;
          } else {
            optionsNode.scrollTop -= 10;
            if(index === 0) {
                if(self.page === 0){
                    if(optionsNode.scrollTop === 0 && Date.now() - self.attachTopTime  > 3000) {
                        console.log('到顶部了')
                        self.attachTopTime = Date.now();
                    } else {
                        optionsNode.scrollTop = Math.max(optionsNode.scrollTop,0);
                        resetSliderPos();
                    }
                } else if(optionsNode.scrollTop <= 0){
                    self.page -= 1;
                    self.$nextTick(() => {
                        optionsNode.scrollTop = ulANode.offsetHeight;
                        resetSliderPos();
                    });
                } else {
                    resetSliderPos();
                }
            } else {
                resetSliderPos();
            }
            console.log(125)
          }
          function resetSliderPos(){
            index = ulALisHeights.findIndex(height => height >= optionsNode.scrollTop);
            block.style.top = `${(slider.offsetHeight/self.totalList.length)*(self.page * self.listSize + index)}px`
            slider.style.top = `${optionsNode.scrollTop}px`;
          };
            // console.log(index,block.style.top,self.page, self.listSize ,self.page * self.listSize + index )
      })

  }, 
  methods:{
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
<style>
    .rview-scroll-list{
        display: inline-block;
        line-height: 36px;
        height: 38px;
        box-sizing: border-box;
        text-align: left;
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
        position: relative;
    }
    .rview-scroll-list ul{
        list-style: none;
    }
    .rview-scroll-list ul li{
        list-style: none;
        line-height: 36px;
        height: 36px;
        background: #ffffff;
        padding: 5px 10px;
    }
    .rview-scroll-list ul li:hover{
        background: #eeeeee;
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
     }
</style>
