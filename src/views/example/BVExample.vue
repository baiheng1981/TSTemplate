<template>
    <div style="border:1px solid #000; width:80%; margin-top:0.3rem; overflow:hidden; padding:0.2rem;">
        <div id="bvtest"></div>
    </div>
</template>
<script lang="ts">
import BaseVue, {Vue, Component} from '../../serve/BaseVue'


@Component({

})
export default class BVExample extends BaseVue {
    //==================data
    // name:string = "ScrollUpUpdate";

    suuInt:number = 0;

    //==================computed

    //==================lifecycle hook
    mounted(){
        console.log("BaseVue: ", this);
        this.setTitle("BaseVue Test...")
    }



}

</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins/util';

</style>