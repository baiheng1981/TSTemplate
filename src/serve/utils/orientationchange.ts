let evt:string = "";
evt = "onorientationchangee" in window ? 'orientationchangee' : 'resize';

function orientationHanlder(event:any):void{
    if(evt=="orientationchangee"){
        if ( window.orientation == 180 || window.orientation==0 ) {
            alert("竖屏");
        }else if( window.orientation == 90 || window.orientation == -90 ){
            alert("横屏");
        }
    }else{
        let width:number = document.documentElement.clientWidth;
        let height:number = document.documentElement.clientHeight;
        if(width < height){
            console.log("竖屏");
        }else if(width > height){
            console.log("横屏");
        }
    }
}

window.addEventListener(evt, orientationHanlder, false);



// orientationHanlder();