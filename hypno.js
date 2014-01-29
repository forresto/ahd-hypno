var width = 640;
var height = 480;


var eyes= [];
var images = [];
var img_threshold = 0.25;

// Will connect to cam
var videoInput = document.createElement('video');
videoInput.width = width;
videoInput.height = height;
var canvasOutput = document.getElementById('canvas');
var cc = canvasOutput.getContext('2d');

// Canvas to clip face
var clipCanvas = document.createElement('canvas');
clipCanvas.width = width;
clipCanvas.height = height;
clipCanvasContext = clipCanvas.getContext('2d');


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

    if (p === 0) {
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

  if(videoInput.currentTime%1<0.1){
    eyes.push(new Eye(point,2));
  }
}

function Eye(pointIndex,size)  {
    this.size=2;
    this.index=pointIndex;
    this.c = Math.random()*360;
    this.death = 15;
    this.draw = function(){
        if(points){
        cc.beginPath();
        cc.arc(points[this.index][0], points[this.index][1], this.size, 0, Math.PI*2, true);
        cc.lineWidth=3;
        cc.strokeStyle="hsla("+this.c+",100%,50%,"+ (0.2+(this.death-this.size)/this.death)+")";
        cc.closePath();
        cc.stroke();
        }
    }
    this.update = function(){
      this.size+=0.3;
      if(this.size>this.death){
        var index = eyes.indexOf(this);
        eyes.splice(index,1);
      }
    }
}

var clipFace = function(points){
  clipCanvasContext.save();
  clipCanvasContext.clearRect(0,0,width,height);
  var path = paths[0];

  clipCanvasContext.beginPath();
  for (var p = 0; p < path.length; p++) {
    var point = points[ path[p] ];
    if (!point) {
      return;
    }
    x = point[0];
    y = point[1];
    if (p === 0) {
      clipCanvasContext.moveTo(x,y);
    } else {
      clipCanvasContext.lineTo(x,y);
    }
  }
  clipCanvasContext.closePath();
  // clipCanvasContext.fill();
  clipCanvasContext.clip();
  clipCanvasContext.drawImage(videoInput, 0, 0, width, height);
  clipCanvasContext.restore();

  // Copy clipped to main
  cc.drawImage(clipCanvas, 0, 0, width, height);
}

var backgroundPattern = function(cc, colors, rotation){
  //circle
  var x = canvas.width / 2;
  var y = canvas.height / 2;

  if(points[33]){
   x = points[33][0];
   y = points[33][1];
  }

  var radius = canvas.height/2.7;
  var startAngle = 0;
  var endAngle = 2 * Math.PI;
  var counterClockwise = false;
  cc.beginPath();
  cc.arc(x, y, radius, startAngle, endAngle, counterClockwise);
  cc.lineWidth = 20;
  cc.strokeStyle = "white";
  cc.stroke();

  //draw rays
  var increment = Math.PI*2 / 24;//84
  var length = canvas.width;


  cc.save();
  cc.translate(x,y);
  cc.rotate(rotation);
  var colIndex=0;
  for(var angle = 0; angle < Math.PI*2; angle+=increment){
    cc.beginPath();
    cc.fillStyle= colors[colIndex];
    colIndex++;colIndex%=colors.length;
    cc.lineWidth = 10;
    cc.moveTo(0,0);
    cc.lineTo(length*Math.cos(angle), length*Math.sin(angle));
    cc.lineTo(length*Math.cos(angle+increment), length*Math.sin(angle+increment));
    cc.closePath();
    cc.fill();
  }
  cc.restore();
}


// Keep track between frames
var vidTime = 0;
var points = [];

function drawLoop() {
  requestAnimationFrame(drawLoop);

  // Time since video started
  vidTime = videoInput.currentTime;

  // Background burst
  var base = (vidTime%1000)/10;
  backgroundPattern(cc,['yellow','magenta'], base);

  // Get points
  points = ctracker.getCurrentPosition();

  // Draw clipped mirrored face to main canvas
  clipFace(points);

  // Draw face lines
  cc.strokeStyle = "hsl(60,100%,50%)";
  cc.lineWidth = 2;
  hypnoFace(cc, points);

  //crazy eye patterns
  for(var i in eyes){
    eyes[i].draw();
    eyes[i].update();
  }

}
drawLoop();

//save frame if above score
setInterval(function(){
  if(ctracker.getScore()>img_threshold){
    var img = new Image();
    img.src = canvas.toDataURL();
    img.style.width="20%";
    $('body').prepend(img);
    var $imgs = $('img');
    var lastImage = $imgs[$imgs.length-1];
    if($(lastImage).offset()['top']>$(window).height()){
      $('img')[0].remove();
    }
  }
},1000);
