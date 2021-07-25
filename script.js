console.log("script.js started");

var scriptsToLoad = ["jquery.min.js","msgpack.min.js", "worker.js"];

scriptsToLoad.forEach(el => {

    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(el);
    s.onload = function () {
        // this.remove();
    };

    (document.head || document.documentElement).appendChild(s);
});

// var worker = new Worker(chrome.runtime.getURL('worker.js'));
// worker.onmessage = function(event) {
//     alert('Message from worker: ' + event.data);
// };