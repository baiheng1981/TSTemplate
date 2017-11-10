<template>
<div style="border:1px solid #000; width:80%; margin-top:0.3rem; overflow:hidden; padding:0.2rem;">
    <!-- start -->
    <div class="my" id="upc">
        <div id="testup" style="margin-right:0.3rem;">
            <p class="childtitle">PullUpUpdate.ts</p>
            JS动态计算移动端rem的解决方案 - 梁大师 - 博客园
2017年2月15日 - JS动态计算移动端rem的解决方案 首先介绍下rem 说起rem就的说px,em; PX为单位 在Web页面初期制作中,我们都是使用“px”来设置我们的文本,因为他比较稳...
www.cnblogs.com/lmaste...  - 百度快照
javascript 取得rem 对应的值 - CSDN博客
2015年11月20日 - javascript 取得rem 对应的值方法 window.getComputed...这个是在原来的基础上增加了一个显示页面。实现点击...templater.js 一款 JavaScript 模板引...
blog.csdn.net/isaisai/...  - 百度快照
JS动态计算移动端rem的解决方案_javascript技巧_脚本之家
2016年10月14日 - 以上所述是小编给大家介绍的JS动态计算移动端rem的解决方案,希望对大家有所帮助...5JS设置cookie、读取cookie、删除 6javascript深入理解js闭包 7JS打...
www.jb51.net/article/9...  - 百度快照
        </div>
        <div id="tag" style='width:100%; height:0.8rem; font-size:0.3rem; background-color:#fefefe; color:#ccc; overflow:hidden; display: -webkit-box; -webkit-box-orient: horizontal; -webkit-box-pack: center; -webkit-box-align: center;'>上拉加载更多</div>
    </div>
    <!-- end -->
</div>
</template>
<script lang="ts">
import {Vue, Component, Util} from "../../serve/BaseVue";
import rem from '../../serve/utils/REM'
import PullUpUpdate from '../../serve/utils/PullUpUpdate';


@Component({

})
export default class PullUpUpdateTep extends Vue {
    //==================data
    name:string = "PullUpUpdate";
    sUU:PullUpUpdate;
    suuInt:number = 0;

    //==================computed

    //==================lifecycle hook
    mounted(){
        this.sUU = new PullUpUpdate(document.getElementById("upc"), document.getElementById("tag"), this.slideUpdateCB)
    }

    slideUpdateCB(_status:string){
        // console.log("加载更多------------：", _status);
        if(_status=="wait"){
            document.getElementById("tag").innerHTML = "上拉加载更多";
        }else if(_status=="ready"){
            document.getElementById("tag").innerHTML = "松开加载";
        }else if(_status=="loading"){
            document.getElementById("tag").innerHTML = "正在加载...";
            setTimeout(()=>{
                this.slideAdd();
            }, 2000)
        }
    }
    slideAdd():void {
        let dom = document.getElementById('testup');
        let domchild = document.createElement('div');
        domchild.innerHTML = '<p style="border:1px solid #ff00cc; margin:0.1rem auto;white-space: pre-wrap;word-break: break-all;"><span style="font-size:0.4rem; font-weight:bold; ">'+this.suuInt+' : </span>wwwwwwwwwwwwwwwwwwwwww{"branch_id":"(uuid)","arriving_at":"2017-05-10 14:20:00","room_group_id":"(uuid)","nickname":"XXXXX","gender":"male","phone":"+8613888888888","people_number":10,"menu_content_id":"(uuid)","remarks":"备注","other":{"birthday":false,"party":false,"not_disturb":true},"deposit_fee":50000,"decorate_fee":50000,"room_id":"(uuid)","lock_id":"(uuid)","sms_push":true}</p>';
        dom.appendChild(domchild);
        this.sUU.restore();
        this.suuInt++;
    }
}

</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins/util';
.my {
    height: size(400);
    overflow-y: auto;
    overflow-x: hidden;
}
</style>