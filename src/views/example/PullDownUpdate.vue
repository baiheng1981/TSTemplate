<template>
    <div style="border:1px solid #000; width:80%; margin-top:0.3rem; overflow:hidden; padding:0.2rem;">
        <!-- start -->
        <div class="my" id="upc2">
            <div id="tag2" style='width:100%; height:0.8rem; font-size:0.3rem; background-color:#fefefe; color:#ccc; overflow:hidden; display: -webkit-box; -webkit-box-orient: horizontal; -webkit-box-pack: center; -webkit-box-align: center;'>下拉刷新</div>
            <div id="testup2">
                <p class="childtitle">PullDownUpdate.ts</p>
                JS动态计算移动端rem的解决方案 - 梁大师 - 博客园
            </div>
        </div>
        <!-- end -->
    </div>
</template>
<script lang="ts">
import {Vue, Component, Util} from "../../serve/BaseVue";
import rem from '../../serve/utils/REM'
import PullDownUpdate from '../../serve/utils/PullDownUpdate';


@Component({

})
export default class PullDownUpdateTep extends Vue {
    //==================data
    name:string = "PullDownUpdate";
    sUU:PullDownUpdate;
    suuInt:number = 0;

    //==================computed

    //==================lifecycle hook
    mounted(){
        this.sUU = new PullDownUpdate(document.getElementById("tag2"), this.slideUpdateCB)
    }

    slideUpdateCB(_status:string){
        // console.log("Down 加载更多------------：", _status);
        if(_status=="wait"){
            document.getElementById("tag2").innerHTML = "上拉加载更多";
        }else if(_status=="ready"){
            document.getElementById("tag2").innerHTML = "松开加载";
        }else if(_status=="loading"){
            document.getElementById("tag2").innerHTML = "正在加载...";
            setTimeout(()=>{
                this.slideAdd();
            }, 1000)
        }
    }
    slideAdd():void {
        let dom = document.getElementById('testup2');
        let domchild = document.createElement('div');
        domchild.innerHTML = '<p style="border:1px solid #ff00cc; margin:0.1rem auto;white-space: pre-wrap;word-break: break-all;"><span style="font-size:0.4rem; font-weight:bold;">'+this.suuInt+' : </span>wwwww"arriving_at":"2017-05-10 14:20:00","room_group_id":"(uuid)","nickname":"XXXXX","gender":"male","phone":"+8613888888888",</p>';
        if(dom) dom.appendChild(domchild);
        this.sUU.restore();
        this.suuInt++;
    }
}

</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins/util';
.my {
    height: size(250);
    overflow-y: auto;
    overflow-x: hidden;
}
</style>