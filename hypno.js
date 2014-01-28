var videoInput = document.getElementById('video');
var canvasInput = document.getElementById('canvas');
var cc = canvasInput.getContext('2d');
var width = canvasInput.width;
var height = canvasInput.height;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

// check for camerasupport
if (navigator.getUserMedia) {
  // set up stream
  
  // chrome 19 shim
  var videoSelector = {video : true};
  if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
    var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
    if (chromeVersion < 20) {
      videoSelector = "video";
    }
  };
  
  navigator.getUserMedia(videoSelector, function( stream ) {
    if (videoInput.mozCaptureStream) {
      videoInput.mozSrcObject = stream;
    } else {
      videoInput.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    }
    videoInput.play();
  }, function() {
    alert("Your brwoser didn't webcam.");
  });
} else {
  alert("Your brwoser doesn't webcam.");
}



var ctracker = new clm.tracker();
ctracker.init(pModel);
ctracker.start(videoInput);

// Fade out
cc.fillStyle = "rgba(0,0,0,0.1)";


function drawLoop() {
  requestAnimationFrame(drawLoop);
  // cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
  // Fade out
  cc.fillStyle = "rgba(0,0,0,0.1)";
  cc.fillRect(0, 0, width, height);
  ctracker.draw(canvasInput);



}
drawLoop();