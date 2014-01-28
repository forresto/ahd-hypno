var width = 640;
var height = 480;

// Will connect to cam
var videoInput = document.createElement('video');
videoInput.width = width;
videoInput.height = height;
var canvasOutput = document.getElementById('canvas');
var cc = canvasOutput.getContext('2d');

// Mirror output
cc.translate(width, 0);
cc.scale(-1, 1);

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
    alert("Your browser didn't webcam.");
  });
} else {
  alert("Your browser doesn't webcam.");
}



var ctracker = new clm.tracker();
ctracker.init(pModel);
ctracker.start(videoInput);
// ctracker.start(canvasInput);





// Face drawing
var paths = [
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], // chin
  [19, 20, 21, 22], // r eyebrow
  [15, 16, 17, 18], // l eyebrow
  [23, 63, 24, 64, 25, 65, 26, 66, 23], // r eye
  [28, 67, 29, 68, 30, 69, 31, 70, 28], // l eye
  27, // r pupil
  32, // l pupil
  [33, 41, 62], // nose bridge
  [34, 35, 36, 42, 37, 43, 38, 39, 40], // nose
  [44, 45, 47, 48, 49, 50, 59, 60, 61, 44], // top lip
  [44, 56, 57, 58, 50, 51, 52, 53, 54, 55, 44] // bottom lip
];

var hypnoFace = function (cc, points) {
  cc.fillStyle = "rgb(200,200,200)";
  cc.strokeStyle = "rgb(130,255,50)";

  for (var i = 0; i < paths.length; i++) {
    if (typeof(paths[i]) == 'number') {
      cc.strokeStyle = "hsl("+Math.random()*360+",100%,50%)";
      drawPoint(cc, paths[i], points);
    } else {
      cc.strokeStyle = "hsl(120,100%,50%)";
      drawPath(cc, paths[i], points);
    }
  }
}

// draw a parametrized line on a canvas
var drawPath = function(canvasContext, path, points) {
  canvasContext.beginPath();
  var i, x, y, a, b;
  for (var p = 0; p < path.length; p++) {

    var point = points[ path[p] ];

    if (!point) {
      return;
    }

    x = point[0];
    y = point[1];

    if (i == 0) {
      canvasContext.moveTo(x,y);
    } else {
      canvasContext.lineTo(x,y);
    }
  }
  canvasContext.moveTo(0,0);
  canvasContext.closePath();

  canvasContext.stroke();
}

// draw a point on a canvas
function drawPoint(canvasContext, point, points) {
  var p = points[ point ];

  if (!p) {
    return;
  }

  x = p[0];
  y = p[1];
  canvasContext.beginPath();
  canvasContext.arc(x, y, 2, 0, Math.PI*2, true);
  canvasContext.closePath();
  canvasContext.stroke();
}





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

// Keep track between frames
var lastVidTime = 0;
var points = [];

function drawLoop() {

  requestAnimationFrame(drawLoop);

  // Background burst
  backgroundPattern();

  // Draw mirrored canvas to main canvas
  clippingCircle();
  cc.drawImage(videoInput, 0, 0, width, height);

  // Fade out
  // cc.fillStyle = "rgba(0,0,0,0.01)";
  // cc.fillRect(0, 0, width, height);

  points = ctracker.getCurrentPosition();

  cc.strokeStyle = "hsl(60,100%,50%)";
  cc.lineWidth = 1;
  hypnoFace(cc, points);

}
drawLoop();
