var canvas = document.querySelector("#mainCanvas");
var ctx = canvas.getContext("2d");
var clearButton = document.querySelector("#clear");
var flagMouseDown = false;
ctx.strokeStyle = ctx.fillStyle = "black";

clearButton.addEventListener("click", e => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = canvas.height = "500";
  });
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

var imageButton = document.querySelector("#imageButton");
imageButton.addEventListener("change", addImage);

function addImage(e) {
  var reader = new FileReader();
  reader.onload = ev => {
    var image = new Image();
    image.onload = () => {
      var scale = 1;
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    image.src = ev.target.result;
  }
  reader.readAsDataURL(e.target.files[0])
}

var test = document.querySelector("#test");
test.addEventListener("click", e => {
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] += 50;
  }
  ctx.putImageData(imageData, 0, 0);
  });
