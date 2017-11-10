<template>
  <div class="bubble" v-show="isShow">
    <p>{{hint_msg}}</p>
  </div>

</template>
<script lang="ts">
  import {Vue, Component, Bus} from "../../serve/BaseVue";

  @Component({
    components: {}
  })

  /**
   * 气泡
   * 调用方法：
   * Bus.$emit('bubble', '提示内容');
   */
  export default class BubbleHint extends Vue {

    isShow: boolean = false;
    hint_msg: string = '';

    mounted() {
      Bus.$on('bubble', (val) => {
        this.show(val);
      })
    }

    show(msg: string): void {
      this.hint_msg = msg;
      this.isShow = true;
      setTimeout(() => {
        this.hint_msg = '';
        this.isShow = false;
      }, 2000)
    }


  }
</script>
<style lang="scss" scoped>
  /*气泡提示---------------------------------------------------------------------------------------------*/

  .bubble {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    text-align: center;
    pointer-events:none;//允许鼠标点击穿透
  }

  .bubble p {
    margin: 70% auto;
    padding: .15rem .2rem;
    color: white;
    white-space: nowrap;
    font-size: 0.28rem;
    text-align: center;
    background: rgba(0, 0, 0, .8);
    display: inline-block;
    border-radius: 5px
  }

  /*气泡提示完---------------------------------------------------------------------------------------------*/
</style>