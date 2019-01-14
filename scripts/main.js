var canvas = document.querySelector("#mainCanvas");
var ctx = canvas.getContext("2d");
var clearButton = document.querySelector("#clear");
var flagMouseDown = false;
ctx.strokeStyle = ctx.fillStyle = "black";

clearButton.addEventListener("click", e => ctx.clearRect(0, 0, canvas.width, canvas.height));
canvas.addEventListener("click", e => drawPixel(e));
canvas.addEventListener("mousedown", e => {
  flagMouseDown = true; 
  ctx.beginPath();
  });
canvas.addEventListener("mouseup", e => flagMouseDown = false);
canvas.addEventListener("mousemove", e => drawLine(e));
  
function drawPixel(e) {
  ctx.fillRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, 2, 2);
}
  
function drawLine(e) {
  if (!flagMouseDown) return;
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
}
