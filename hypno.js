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
    alert("Your browser didn't webcam.");
  });
} else {
  alert("Your browser doesn't webcam.");
}



var ctracker = new clm.tracker();
ctracker.init(pModel);
ctracker.start(videoInput);





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
  //cc.lineWidth = 1;
  
  for (var i = 0; i < paths.length; i++) {
    if (typeof(paths[i]) == 'number') {
      drawPoint(cc, paths[i], points);
    } else {
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

  cc.strokeStyle = "hsl("+Math.random()*360+",100%,50%)";
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





function drawLoop() {
  requestAnimationFrame(drawLoop);
  // cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
  // Fade out
  cc.fillStyle = "rgba(0,0,0,0.1)";
  cc.fillRect(0, 0, width, height);

  var points = ctracker.getCurrentPosition();

  cc.strokeStyle = "hsl(60,100%,50%)";
  hypnoFace(cc, points);

  // ctracker.draw(canvasInput);

}
drawLoop();