var videoInput = document.createElement('video');
videoInput.height=480;
videoInput.width=640;
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


var clippingCircle = function(){
  var x = canvas.width / 2;
  var y = canvas.height / 2;
  var radius = canvas.height/2.7;
  var startAngle = 0;
  var endAngle = 2 * Math.PI;
  var counterClockwise = false;
  cc.beginPath();
  cc.arc(x, y, radius, startAngle, endAngle, counterClockwise);
  cc.lineWidth = 50;
  cc.clip();
}

var backgroundPattern = function(){
  //circle
  var x = canvas.width / 2;
  var y = canvas.height / 2;
  var radius = canvas.height/2.7 + 10;
  var startAngle = 0;
  var endAngle = 2 * Math.PI;
  var counterClockwise = false;
  cc.beginPath();
  cc.arc(x, y, radius, startAngle, endAngle, counterClockwise);
  cc.lineWidth = 20;
  cc.strokeStyle = "white";
  cc.stroke();

  //draw rays
  var increment = Math.PI*2 / 80;
  var length = canvas.width;
  var x = canvas.width / 2;
  var y = canvas.height / 2;

  for(var angle = 0; angle < Math.PI*2; angle+=increment){
    cc.beginPath();
    cc.moveTo(x,y);
    cc.lineTo(x+length*Math.cos(angle), y+length*Math.sin(angle));
    cc.strokeStyle = 'white';
    cc.lineWidth = 15;
    cc.closePath();
    cc.stroke();
  }
}

function drawLoop() {

  requestAnimationFrame(drawLoop);

  backgroundPattern();

  clippingCircle();
  cc.drawImage(videoInput, 0, 0, canvas.width, canvas.height);
  // cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
  // Fade out
  cc.fillStyle = "rgba(0,0,0,0.1)";
  cc.fillRect(0, 0, width, height);
  cc.lineWidth = 5;
  ctracker.draw(canvasInput);
}
drawLoop();


