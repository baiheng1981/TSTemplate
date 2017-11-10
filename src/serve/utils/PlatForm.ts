import Data from '../../model/Data';

const PlatForm = {
    plat: 'pc',
    //检查是否是pc端
    checkPc(): boolean {
        return navigator.userAgent.toLowerCase().indexOf('mobile') < 0;
    },
    //检查是否浏览器
    checkBrowser(): boolean {
        return !this.checkWechart(this.plat) && !this.checkQQ(this.plat) && !this.checkWeibo(this.plat)
    },
    //检查是否为安卓
    checkAndroid(): boolean {
        return this.plat.indexOf("android") > 0;
    },
    //检查是否为ios
    checkIos(): boolean {
        let _iphone = this.plat.match(/iphone/i) ? this.plat.match(/iphone/i).toString() : "";
        let _ipad = this.plat.match(/ipad/i) ? this.plat.match(/ipad/i).toString() : "";
        return _iphone == 'iphone' || _ipad == 'ipad';
    },
    //检查是否ios9及以上
    checkIos9(): boolean {
        var isPhone = this.plat.match(/OS [0-9]+_\d[_\d]* like Mac OS X/i);
        return isPhone && isPhone.length > 0 && parseInt(isPhone[0].split(" ")[1]) >= 9;
    },
    //检查是否微信
    checkWechart(): boolean {
        return this.plat.indexOf("micromessenger") > 0;
    },
    //检查是否qq 内置浏览器
    checkQQ(): boolean {
        return this.plat.indexOf("qq/") > 0;
    },
    //检查是否微博
    checkWeibo(): boolean {
        return this.plat.indexOf("weibo") > 0;
    },
    //safari
    checkSafari(): boolean {
        //排除几个主流浏览器 百度 360 uc qq chrome
        return !/baidubrowser|qhbrowser|ucbrowser|mqqbrowser|crios/.test(this.plat) && /safari/.test(this.plat)
    }
}

export function IdentifyPlatform() {
    PlatForm.plat = navigator.userAgent.toLowerCase();
    let plat = PlatForm.plat;
    console.log("navigator.userAgent:", plat, "\nnavigator.platform:", navigator.platform)
    if (navigator.platform.indexOf('Win') > -1) {
        Data.platform = 'pc';
    } else {
        if (plat.indexOf('mobile') > -1) {
            //移动端
            if (PlatForm.checkAndroid()) {
                Data.platform = 'android';
            } else if (PlatForm.checkIos()) {
                Data.platform = 'ios';
            }
        } else {
            //pc
            Data.platform = 'pc';
        }
    }
}

export function downloadIOS() {
    // alert("ios")
    window.location.href = "https://itunes.apple.com/cn/app/id1112801526?mt=8";
}
export function downloadAndroid() {
    // alert("android")
    window.location.href = "http://activity.okchang.com/apk/HaoChang4.7.1.apk";
}

export function download() {
    if (PlatForm.checkWechart() == true || PlatForm.checkWeibo() == true) {
        //微信内部浏览器/新浪微博内部浏览器，点击弹出提示引导
        return;
    }
    //ios
    if (PlatForm.checkAndroid() == true) {
        downloadAndroid();
    }
    //android
    if (PlatForm.checkIos() == true) {
        downloadIOS();
    }
}


export default PlatForm;