<template>
	<div>
		<div class="download" v-if="footVisible">
			<div class="logo">
				<img src="../../assets/images/icon/icon_dl_logo.png" /><span class="fs28">好唱Party-不打烊的线上KTV</span>
			</div>
			<div class="btn fs28" @click="helpExplorerStatus(true)">下载</div>
		</div>
		<div class="help" v-if="helpExplorerVisible" @click="helpExplorerStatus(false)">
			<div class="help-explorer"></div>
		</div>
	</div>
</template>
<script lang="ts">
import {Vue, Component, Data} from "../../serve/BaseVue";

import PlatForm, {download} from '../../serve/utils/PlatForm';

@Component({
    components:{

    },
	props:{
		helpVisible: {
			type: Boolean,
			default: false
		},
		/** 是否显示下载条 */
		footVisible:{
			type:Boolean,
			default: true
		}
	}
})
export default class Download extends Vue {
	helpVisible:boolean;
	helpExplorerVisible:boolean = false;

	mounted():void {
		this.helpExplorerVisible = this.helpVisible;

	}

	/**
	 * @argument _bo 是否
	 */
	helpExplorerStatus(_bo:boolean):void {
        if(PlatForm.checkWechart()==true || PlatForm.checkWeibo()==true){
            //微信内部浏览器/新浪微博内部浏览器，点击弹出提示引导
            this.helpExplorerVisible = _bo;
            return;
        }
        download();
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins/util';
.download{
	@include ik-box;
	@include ik-box-align(center);
	@include ik-box-pack(justify);
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: size(100);
	background-color: #fbfbfb;
	z-index: 99;
	margin-top: size(60);
	border-top: 1px solid #d7d7d7;
}
.btn {
	display: block;
	margin-right: size(30);
	height: size(50);
	min-width: size(120);
	line-height: size(50);
	@include border-radius(size(25));
	text-align: center;
	padding:0 size(10);
	overflow: hidden;
	border: 1px solid #ff4a64;
	background-color: #ff4a64;
	color: #ffffff;
}
.logo {
	margin-left: size(14);
	img {
		width: size(76);
		height: size(76);
	}
	span {
		margin-left: size(14);
		color: #182846;
		line-height: 1;
		vertical-align: middle;
	}
}
.help {
	width: 100%;
	height: 100%;
	background-color: #000;
	opacity: 0.8;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 100;
	.help-explorer {
		width: size(566);
		height: size(306);
		position: absolute;
		top: size(8);
		right: size(45);
		background-image: url('../../assets/images/help_explorer.png');
		background-size: 100% 100%;
	}
}
</style>
