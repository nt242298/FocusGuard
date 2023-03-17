let port = null;
let videoStream = null;
let canvas = null;
let ctx = null;

chrome.runtime.onConnect.addListener((p) => {
  port = p;
});

chrome.runtime.sendMessage({ type: "startCapture" }, (response) => {
  if (response.error) {
    console.error(response.error);
  } else {
    videoStream = response.stream;
    const video = document.createElement("video");
    video.srcObject = videoStream;
    video.autoplay = true;
    document.body.appendChild(video);
    video.addEventListener("play", () => {
      canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx = canvas.getContext("2d");
      requestAnimationFrame(update);
    });
  }
});

function update() {
  if (!videoStream) return;
  if (ctx) ctx.drawImage(videoStream, 0, 0, canvas.width, canvas.height);
  if (port) port.postMessage({ image: canvas.toDataURL("image/jpeg") });
  requestAnimationFrame(update);
}
