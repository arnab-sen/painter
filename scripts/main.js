var canvas = document.querySelector("#mainCanvas");
var canvasImage = null;
var mainColourCanvas = document.querySelector("#mainColourCanvas");
var ctx = canvas.getContext("2d");
var mainColourCtx = mainColourCanvas.getContext("2d");
var clearButton = document.querySelector("#clear");
var colourButton = document.querySelector("#colours");
var flags = {
  "mousedown" : false, 
  "paint" : true, 
  "getColour" : false,
  "displayColours" : false};
  
var redSlider = document.querySelector("#redSlider");
var greenSlider = document.querySelector("#greenSlider");
var blueSlider = document.querySelector("#blueSlider")
var mainColour;
updateMainColour(0, 0, 0, 255);

// Initialise slider thumb positions at rgb(0, 0, 0)
redSlider.stepDown(255);
greenSlider.stepDown(255);
blueSlider.stepDown(255);

function updateMainColour(r, g, b, a = 255) {
  colour = `rgba(${r}, ${g}, ${b}, ${a})`;
  var mainColourLabel = document.querySelector("#mainColourLabel");
  mainColourLabel.innerHTML = "Current colour: " + `rgb(${r}, ${g}, ${b})`;
  mainColour = colour;
  ctx.strokeStyle = ctx.fillStyle = mainColour;
  mainColourCanvas.style.backgroundColor = mainColour;
  redSlider.stepDown(255);
  redSlider.stepUp(r);
  greenSlider.stepDown(255);
  greenSlider.stepUp(g);
  blueSlider.stepDown(255);
  blueSlider.stepUp(b);
}

clearButton.addEventListener("click", e => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateMainColour(redSlider.value, greenSlider.value, blueSlider.value);
});
canvas.addEventListener("click", e => drawPixel(e));
canvas.addEventListener("mousedown", e => {
  flags["mousedown"] = true; 
  if (!flags["paint"]) return;
  ctx.beginPath();
});
canvas.addEventListener("mouseup", e => flags["mousedown"] = false);
canvas.addEventListener("mousemove", e => drawLine(e));

document.querySelector("#sliders").addEventListener("input", e => 
  updateMainColour(redSlider.value, greenSlider.value, blueSlider.value)
);

colourButton.addEventListener("click", e => {
  updateMainColour(redSlider.value, greenSlider.value, blueSlider.value);
  flags["displayColours"] = !flags["displayColours"];
  if (flags["displayColours"]) {
    document.querySelector("#sliders").style.display="block";
  } else {
    document.querySelector("#sliders").style.display="none";
  }
});

var decreaseBrushSizeButton = document.querySelector("#decreaseBrushSize");
decreaseBrushSizeButton.addEventListener("click", e => {
  if (ctx.lineWidth > 1) ctx.lineWidth -= 1;
});

var increaseBrushSizeButton = document.querySelector("#increaseBrushSize");
increaseBrushSizeButton.addEventListener("click", e => {
  ctx.lineWidth += 1;
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
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    image.src = ev.target.result;
  }
  reader.readAsDataURL(e.target.files[0])
}

function getColourAt(x, y) {
  /* Returns the RGBA values at the (x, y)-positioned pixel on the canvas */
  var colour = ctx.getImageData(x, y, 1, 1).data;
  updateMainColour(colour[0], colour[1], colour[2], a = colour[3]);
  return colour;
}

canvas.addEventListener("click", e => {
  if (flags["getColour"]) {
    getColourAt(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  }
});

var paintButton = document.querySelector("#paint");
paintButton.addEventListener("click", () => {flags["getColour"] = false; flags["paint"] = true;});

var colourPicker = document.querySelector("#colour-picker");
colourPicker.addEventListener("click", () => {flags["paint"] = false; flags["getColour"] = true;});

var opacityChanger = document.querySelector("#opacityChanger");
opacityChanger.addEventListener("click", e => {
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  imageData = changeOpacity(imageData, 0);
  ctx.putImageData(imageData, 0, 0);
});

function changeOpacity(imageData, opacity) {
  /* Changes the alpha value of each pixel that matches mainColour */
  for (var i = 0; i < imageData.data.length; i += 4) {
    var r, g, b, a;
    r = imageData.data[i];
    g = imageData.data[i + 1];
    b = imageData.data[i + 2];
    a = imageData.data[i + 3];
    if (`rgba(${r}, ${g}, ${b}, ${a})` == mainColour) {
      imageData.data[i + 3] = opacity;
    }
  }
  return imageData;
}


