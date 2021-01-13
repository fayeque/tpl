
var isSWR=false;
if(!isSWR){
    if('serviceWorker' in navigator){
        navigator.serviceWorker.register('/sw.js').then(() => {
            console.log("Service worker registered");
            isSWR=true;
        })
    }
}


// var vt=document.querySelectorAll("a");

// console.log(vt);

