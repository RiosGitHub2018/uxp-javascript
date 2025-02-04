function onloadstart(event) {
    console.log("events onloadstart : ", event.url)
    document.getElementById("log").value = "loadstart:" + event.url + "\n" + document.getElementById("log").value;
}
function onloadstop(event) {
    console.log("events onloadstop : ", event.url)
    document.getElementById("log").value = "loadstop:" + event.url + "\n" + document.getElementById("log").value;
}
function onloaderror(event) {
    console.log("events onloaderror : ", event.url)
    document.getElementById("log").value = "loaderror:" + event.url + "\n" + document.getElementById("log").value;
}
function showWebView() {
    let dialog = document.getElementById("webViewDialog");
    document.appendChild(dialog).showModal();
}
let webViewDisplay = document.getElementById("webviewSample");
function sendPostMessageTriangle() {
    webViewDisplay.postMessage("2D Triangle");
}
function sendPostMessageRotatingTriangle() {
    webViewDisplay.postMessage("Transformed Triangle");
}

const openWebView = document.getElementById("openDialog");
const triangle = document.getElementById("2DBtn");
const rotatingTriagle = document.getElementById("2DBtnTriangle");
openWebView.onclick = showWebView;
triangle.onclick = sendPostMessageTriangle;
rotatingTriagle.onclick = sendPostMessageRotatingTriangle;
console.log("events being added")
webViewDisplay.addEventListener("loadstart", onloadstart);
webViewDisplay.addEventListener("loadstop", onloadstop);
webViewDisplay.addEventListener("loaderror", onloaderror);
console.log("events added")
window.addEventListener("message", (e) => {
    console.log(`Message from WebView(Origin:${e.origin}): ${e.data}\n`);
    if (e.data.key === "imageDetails") {
        document.getElementById("testImg").src = e.data.value;
        webViewDisplay.postMessage(" Thanks, snapshot received successfully");
    }
    else if (e.data.key === "canvasDetails") {
        document.getElementById("logWebview").innerText = e.data.value;
        webViewDisplay.postMessage(" Thanks, Canvas specifications received successfully");
    }
});