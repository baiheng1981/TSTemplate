class REM {
    userAgent:string;
    dpr: number;
    scale: number;
    rem: number;
    evt: string;
    standardSize: number = 75;//(750px设计图标准/10 = 75)

    reRem:Function;

    constructor() {
        let _agent = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios|SymbianOS)/i);
        this.userAgent = "pc";
        if (_agent != null) {
            this.userAgent = "moblie";
        }

        this.reRem = this.reRemByDpr;
        // this.reRem = this.reRemByWidth;
        this.reRem();
    }
    reRemByDpr(): void {
        console.log("reRem >>>>>>>>>>>>>>>>>>");
        let metaTag: HTMLMetaElement = this.addMetaContent();

        this.dpr = window.devicePixelRatio || 1;//获取屏幕像素比
        this.scale = 1 / this.dpr;

        let width:number = document.documentElement.clientWidth || document.body.clientWidth;
        let height:number = document.documentElement.clientHeight || document.body.clientHeight;
        let devWidth:number = Math.min(width, height);
        // devWidth = Math.min(this.standardSize*10, devWidth);
        this.rem = devWidth * this.dpr / 10;
        if(this.userAgent=="pc"){
            this.rem = devWidth * this.dpr / 20;
        }

        document.documentElement.setAttribute('data-dpr', this.dpr.toString());

        metaTag.content = "width=device-width,initial-scale=" + this.scale + ",maximum-scale=" + this.scale + ",user-scalable=no";

        console.log("dpr:" + this.dpr, "scalez:" + this.scale, "clientW:" + devWidth, "rem:" + this.rem);

        document.documentElement.style.fontSize = this.rem + 'px';

        this.addResize();
    }
    reRemByWidth(_value?:number):void {
        let metaTag: HTMLMetaElement = this.addMetaContent();

        let value:number = _value || this.standardSize*10;
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        let devWidth = Math.min(width, height);
        document.documentElement.style.fontSize = Math.ceil(devWidth / (value / this.standardSize)) + 'px';
    }

    addMetaContent():HTMLMetaElement {
        let metaTag: HTMLMetaElement = document.getElementsByTagName('meta')['viewport'];
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = "viewport"
            document.getElementsByTagName('head')[0].appendChild(metaTag);
        }
        metaTag.content = "width=device-width,initial-scale=" + 1 + ",maximum-scale=" + 1 + ",user-scalable=no";
        return metaTag;
    }

    addResize(): void {
        this.evt = "onorientationchange" in window ? 'orientationchange' : 'resize';
        setTimeout(() => {
            window.addEventListener(this.evt, this.orientationHanlder, false);
        }, 300);
    }
    orientationHanlder = (event: Event): void => {
        console.log("=============event:", event);
        setTimeout(() => {
            this.reRem();
        }, 100);
        if (this.evt == "orientationchangee") {
            /* if ( window.orientation == 180 || window.orientation==0 ) {
                alert("竖屏");
            }else if( window.orientation == 90 || window.orientation == -90 ){
                alert("横屏");
            } */
        } else {
            /* const width:number = document.documentElement.clientWidth;
            const height:number = document.documentElement.clientHeight;
            if(width < height){
                console.log("竖屏");
            }else if(width > height){
                console.log("横屏");
            } */
        }
    }

    /**自定义方法************************************************************************/
    pixelToRem(_num: number): number {
        return _num / this.standardSize * this.rem;
    }

    //获取屏幕分辨率
    getViewportSize(): object {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        };
    }

    /**end 自定义方法************************************************************************/
}
export default new REM();
