(function(){
  "use strict";
  document.addEventListener("click",function(event){
    const button=event.target.closest("[data-go-back]");
    if(!button)return;
    event.preventDefault();
    let previousIsSameSite=false;
    try{previousIsSameSite=Boolean(document.referrer)&&new URL(document.referrer).origin===location.origin;}catch(_error){}
    if(previousIsSameSite&&history.length>1){history.back();return;}
    location.href="index.html";
  });
})();
