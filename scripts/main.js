var canvas = document.querySelector("#mainCanvas");
var canvasImage = null;
var ctx = canvas.getContext("2d");
var clearButton = document.querySelector("#clear");
var colourButton = document.querySelector("#colours");
var flags = {
  "mousedown" : false, 
  "paint" : true, 
  "getColour" : false,
  "displayColours" : false};
var mainColour = "rgb(0, 0, 0, 255)";
ctx.strokeStyle = ctx.fillStyle = mainColour;

clearButton.addEventListener("click", e => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = canvas.height = "500";
});
canvas.addEventListener("click", e => drawPixel(e));
canvas.addEventListener("mousedown", e => {
  flags["mousedown"] = true; 
  if (!flags["paint"]) return;
  ctx.beginPath();
});
canvas.addEventListener("mouseup", e => flags["mousedown"] = false);
canvas.addEventListener("mousemove", e => drawLine(e));

var redSlider = document.querySelector("#redSlider");
var greenSlider = document.querySelector("#greenSlider");
var blueSlider = document.querySelector("#blueSlider");
document.querySelector("#sliders").addEventListener("input", e => {
  var colour = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
  mainColour = colour;
  ctx.strokeStyle = ctx.fillStyle = mainColour;
  var c = document.querySelector("#mainColourCanvas");
  c.getContext("2d").fillStyle = mainColour;
  c.getContext("2d").fillRect(0, 0, c.width, c.height);
});

colourButton.addEventListener("click", e => {
  var c = document.querySelector("#mainColourCanvas");
  c.style.backgroundColor = `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`;
  ctx.strokeStyle = ctx.fillStyle = c.style.backgroundColor;
  flags["displayColours"] = !flags["displayColours"];
  if (flags["displayColours"]) {
    document.querySelector("#sliders").style.display="block";
  } else {
    document.querySelector("#sliders").style.display="none";
  }
});

  
function drawPixel(e) {
  if (!flags["mousedown"] || !flags["paint"]) return;
  ctx.fillRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, 2, 2);
}
  
function drawLine(e) {
  if (!flags["mousedown"] || !flags["paint"]) return;
  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
}

var imageButton = document.querySelector("input[type=file]");
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

function getColourAt(x, y) {
  /* Returns the RGBA values at the (x, y)-positioned pixel on the canvas */
  var colour = ctx.getImageData(x, y, 1, 1).data;
  console.log(x, y);
  console.log(colour);
  mainColour = `rgb(${colour[0]}, ${colour[1]}, ${colour[2]}, ${colour[3]})`;
  ctx.strokeStyle = ctx.fillStyle = mainColour;
  return colour;
}

canvas.addEventListener("click", e => {
  if (flags["getColour"]) {
    return getColourAt(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  }
});

var paintButton = document.querySelector("#paint");
paintButton.addEventListener("click", () => {flags["getColour"] = false; flags["paint"] = true;});

var colourPicker = document.querySelector("#colour-picker");
colourPicker.addEventListener("click", () => {flags["paint"] = false; flags["getColour"] = true;});

var test = document.querySelector("#test");
test.addEventListener("click", e => {
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(imageData.data.slice(0, 20));
  for (var i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] += 50;
  }
  ctx.putImageData(imageData, 0, 0);
});


