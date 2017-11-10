<template>
    <div id="content">
        <router-view></router-view>
        <loading></loading>
        <bubble></bubble>
    </div>
</template>
<script lang="ts">
import {Vue, Component} from "../serve/BaseVue";

@Component({
    components:{

    }
})
export default class App extends Vue {
    //==================data
    name:string = "App.vue";
    //==================computed


    //==================lifecycle hook
    mounted(){
        console.log(this.name+" loaded!");

    }




    //==================method
}
</script>

<style lang="sass">
@import '../assets/style/mixins/util'

#content
    -webkit-text-size-adjust : none
    -moz-text-size-adjust : none
    -ms-text-size-adjust : none
    text-size-adjust : none
    height : 100%
</style>

