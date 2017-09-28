let tid:number;
function reRem (_value?:number){
    let value:number = _value || 750;
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    let devWidth = height > width ? width : height;
    if (devWidth > value) devWidth = value; //取短后是否会大于750
    document.documentElement.style.fontSize = devWidth / (value / 100) + 'px';
}

reRem();

window.addEventListener('resize', ()=>{
    clearTimeout(tid);
    tid = setTimeout(reRem, 300);
}, false);

window.addEventListener('pageshow', (e)=>{
    if (e.persisted) {
        clearTimeout(tid);
        tid = setTimeout(reRem, 300);
    }
}, false);


