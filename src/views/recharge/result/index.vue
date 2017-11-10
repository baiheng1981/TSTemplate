<template>
  <section class="recharge-result-main">
    <div class="success-info color-white">
      <div class="box">
        <i class="icon-success">&nbsp;</i>
        <p class="show fs36 success-p">支付成功</p>
        <p class="show fs60 ">￥68.00</p>
      </div>
      <p class="fs28 explain">实际到账时间可能会有1-2个工作日延迟。</p>
      <p class="fs28 explain">若逾期未到账，请联系客服。</p>
      <div class="state-box border-t"
           @click="routerShift('/recharge/list')">
        <div class="text-box">
          <i class="icon-money">&nbsp;</i>
          <span class="fs28 text-span">继续充值</span>
        </div>
        <i class="icon-arrow">&nbsp;</i>
      </div>
    </div>
    <button class="fs30 color-white"
            @click="routerShift('/home')">
      返回首页
    </button>
    <Download ref="download"></Download>
  </section>

</template>
<script lang='ts'>
  import BaseVue, {Component} from '../../../serve/BaseVue'

  @Component({
    components:{

    }
  })
  export default class RechargeResult  extends BaseVue {
    //==================data
    name:string = 'Home';

    //==================computed


    //==================lifecycle hook
    mounted():void{
      this.setTitle('支付结果');
      this.init();
    }

    destroyed():void{
      // console.log('destroyed~~~~~~', this.title)

    }

    //==================method
    init():void {

    }






  }
</script>
<style lang='sass'>
  @import './index.sass';
</style>