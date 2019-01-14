var canvas = document.querySelector("#mainCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(10, 10, 100, 100);

var clearButton = document.querySelector("#clear");
var flagMouseDown = false;
var strokePath = new Path2D();
clearButton.addEventListener("click", e => {ctx.clearRect(0, 0, canvas.width, canvas.height);});
canvas.addEventListener("click", e => {
  drawAtCurrentPos(e.clientX, e.clientY, 2);
  });
canvas.addEventListener("mousedown", e => {
  flagMouseDown = true; 
  ctx.beginPath();
  drawAtCurrentPos(e.clientX, e.clientY, 2);
  });
canvas.addEventListener("mouseup", e => {flagMouseDown = false;});
canvas.addEventListener("mousemove", e => {
  if (flagMouseDown) drawAtCurrentPos(e.clientX, e.clientY, path = strokePath, 1);
  });
  
function drawAtCurrentPos(x, y, pixelSize, path = null, color = null) {
  if (color != null) ctx.fillStyle = color;
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  if (path != null) {
    ctx.lineTo(x, y);
    ctx.stroke();
  } else {
    ctx.fillRect(x, y, pixelSize, pixelSize);
  }
}
  

