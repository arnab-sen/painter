var canvas = document.querySelector("#mainCanvas");
var ctx = canvas.getContext("2d");
var clearButton = document.querySelector("#clear");
var flagMouseDown = false;
var strokePath = new Path2D();
ctx.strokeStyle = ctx.fillStyle = "black";

clearButton.addEventListener("click", e => {ctx.clearRect(0, 0, canvas.width, canvas.height);});

canvas.addEventListener("click", e => 
  ctx.fillRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, 2, 2));
  
canvas.addEventListener("mousedown", e => {
  flagMouseDown = true; 
  ctx.beginPath();
  });
  
canvas.addEventListener("mouseup", e => flagMouseDown = false);

canvas.addEventListener("mousemove", e => {
  if (flagMouseDown) drawAtCurrentPos(e.clientX, e.clientY, 2, 2)
  });
  
function drawAtCurrentPos(x, y, color = null) {
  if (color != null) ctx.strokeStyle = ctx.fillStyle = color;
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  ctx.lineTo(x, y);
  ctx.stroke();
}
