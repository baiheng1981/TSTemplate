<template>
    <div class="Login">
        <div class="logo"></div>
        <div class="switch"><span @click="switchLogin()">{{isMobile?'切换邮箱登录':'切换手机登录'}}</span></div>
        <!--邮箱-->
        <div v-if="!isMobile">
            <div class="input_name">
                <input placeholder="输入邮箱" v-model="input_tel" />
                <div class="clear"></div>
            </div>
            <div class="input_name mt30">
                <input placeholder="输入密码" type="password" />
                <div class="clear"></div>
            </div>
            <div class="mail_input_name input_name mt30">
                <input placeholder="输入验证码" type="tel" class="verify-input color-333" />
                <div class="verify-code">
                    <img src="" v-if="verifyCodeLoadingShow" />
                    <div class="verify-refresh color-333">换一个</div>
                </div>

            </div>
        </div>
        <!--手机-->
        <div v-if="isMobile">
            <div class="input_name">
                <input placeholder="输入手机号" type="tel" />
                <div class="clear"></div>
            </div>
            <div class="verify-mobile mt30">
                <div class="verify-input_name verify-left">
                    <input placeholder="输入验证码" type="tel" class="color-333" />
                    <div class="clear"></div>
                </div>
                <div class="verify-input_name verify-right">
                    <div class="btn fs28 color-333">获取验证码</div>
                </div>
            </div>
        </div>
        <!--登录control-->
        <div class="btn-login" @click="login()">登录</div>
        <div class="txt-login-warning color-a6a7a8" v-if="!noAccount">若未注册账号，请先<a class="text-underline color-ff4a64" @click="appDownload()">下载客户端</a>并注册</div>
        <div class="txt-login-warning color-a6a7a8" v-if="noAccount"><a class="color-ff4a64">账号不存在，</a>请先<a class="text-underline color-ff4a64" @click="appDownload()">下载客户端</a>并注册</div>

        <div class="other-login color-a6a7a8"><span>其他登录方式</span></div>
        <div class="other-login-list">
            <div class="icon"><img src="../../assets/images/icon/icon_lg_QQ.png" /></div>
            <div class="icon"><img src="../../assets/images/icon/icon_lg_weixin.png" /></div>
            <div class="icon"><img src="../../assets/images/icon/icon_lg_weibo.png" /></div>
            <div class="icon"><img src="../../assets/images/icon/icon_lg_facebook.png" /></div>
        </div>

        <Download ref="download"></Download>
    </div>
</template>
<script lang="ts">
import BaseVue, {Component, Data, Bus} from "../../serve/BaseVue";

@Component({
    components:{

    }
})
export default class Login extends BaseVue {
    //==================data
    name:string = "Login";
    noAccount:boolean = false;
    isMobile:boolean = false;
    //===========================邮箱
    input_tel:string = "2.com";
    verifyCodeLoadingShow:boolean = true;//是否显示验证码图片 | 显示验证码loading
    //===========================手机



    //==================computed



    //==================lifecycle hook
    mounted():void{
        console.log(this.name+" loaded!");
        this.setTitle("登录好唱Party账号");
        this.init();


    }

    destroyed():void{
        // console.log("destroyed~~~~~~", this.title)

    }

    //==================method
    init():void {

    }
    switchLogin():void {
        this.isMobile = !this.isMobile;
    }

    login():void {
        Bus.$emit('bubble', '点了登录');
    }












    appDownload():void {
        (this.$refs.download as any).helpExplorerStatus(true);
    }



}
</script>
<style lang="scss" scoped>
@import './Login.scss';
</style>

