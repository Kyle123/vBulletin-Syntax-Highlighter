(document.head||document.documentElement).appendChild(plg);
plg.onload = function() {
    var scr = document.createElement('script');
    scr.src = chrome.extension.getURL('background.js');
    
    (document.head||document.documentElement).appendChild(scr);
    scr.onload = function() {
       scr.parentNode.removeChild(scr);
};
};
