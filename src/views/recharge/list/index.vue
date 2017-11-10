<template>
  <section class="recharge-list-main">
    <div class="top-box">
      <div class="head-box">
        <div class="left-box">
          <div class="user-img">
            <i class="icon-photo-border">&nbsp;</i>
          </div>
          <div class="user-info">
            <p class="fs32 name text-overflow">用户用户名用户名用户名用户名用户名用户名名</p>
            <p class="fs24 color-gray">ID&nbsp;<span>1234567</span></p>
            <p class="fs28 color-gray">余额：<span class="color-red">12222K豆</span></p>
          </div>
        </div>
        <div class="btn-box fs28 color-gradient"
             @click="outLogin">
          退出
        </div>
      </div>
      <div class="payment-title border-b">
        <div>
          <i class="icon-pay"
             :class="{'icon-weixin':isWeixin}">&nbsp;</i>
          <span class="fs30"
                v-text="isWeixin ? '微信支付':'支付宝支付'"></span>
        </div>
        <div class="contact-box">
          <i class="icon-customer-service">&nbsp;</i>
          <span class="fs28">客服</span>
        </div>
      </div>
    </div>
    <div class="list-box">
      <ul>
        <li class="border-b">
          <div class="price-box">
            <div>
              <i class="icon-k-bean">&nbsp;</i>
              <span class="fs32 k-number">610000K豆</span>
              <i class="icon-sale color-gradient">折扣</i>
            </div>
            <div class="fs26 color-gray">
              <span class="cost-price">原价￥6100.00</span>
              <span>￥4988.00</span>
            </div>
          </div>
          <div class="check-box">
            <label>
              <input type="radio"
                     value="0"
                     v-model="goods"
                     checked>
            </label>
          </div>
        </li>
        <li class="border-b">
          <div class="price-box">
            <div>
              <i class="icon-k-bean">&nbsp;</i>
              <span class="fs32 k-number">123456789123456789K豆</span>
            </div>
            <div class="fs26 color-gray">
              <span class="cost-price">原价￥6100.00</span>
              <span>￥4988.00</span>
            </div>
          </div>
          <div class="check-box">
            <label>
              <input type="radio"
                     value="1"
                     v-model="goods">
            </label>
          </div>
        </li>
        <li class="border-b">
          <div class="price-box">
            <div>
              <i class="icon-k-bean">&nbsp;</i>
              <span class="fs32 k-number">610000K豆</span>
              <i class="icon-sale color-gradient">折扣</i>
            </div>
            <div class="fs26 color-gray">
              <span>￥4988.00</span>
            </div>
          </div>
          <div class="check-box">
            <label>
              <input type="radio"
                     value="2"
                     v-model="goods">
            </label>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom-box">
      <p class="show fs32">
        <span>610000</span>K豆,支付<span class="color-red">4988.<span class="fs24">00</span>元</span>
      </p>
      <button class="show fs32 color-gradient">
        立即充值
      </button>
    </div>
  </section>

</template>
<script lang='ts'>
  import BaseVue, {Component, Data, Bus} from '../../../serve/BaseVue'
  import PlatForm from '../../../serve/utils/PlatForm';

  @Component({
    components: {}
  })
  export default class RechargeList extends BaseVue {
    //==================data
    isWeixin: boolean = false;
    goods: string = '0';

    //==================computed


    //==================lifecycle hook
    mounted(): void {

      this.setTitle('好唱Party账户充值');
      this.isWeixin = PlatForm.checkWechart();

      Bus.$emit('loading', false);

      this.init();
    }

    destroyed(): void {
      // console.log('destroyed~~~~~~', this.title)

    }

    //==================method
    init(): void {


    }

    outLogin(): void {
      Data.clearCookie(); //清除所有cookie
      this.routerShift('/home');
    }


  }
</script>xin
<style lang='sass'>
  @import './index.sass';
</style>