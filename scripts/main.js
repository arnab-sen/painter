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
  "displayColours" : false,
  "startSelection" : false,
  "moveSelection" : false};
  
var redSlider = document.querySelector("#redSlider");
var greenSlider = document.querySelector("#greenSlider");
var blueSlider = document.querySelector("#blueSlider")
var mainColour;
updateMainColour(255, 255, 255, 255);
var selection = {"x1" : null, "y1" : null, "x2" : null, "y2" : null, "imageData" : null};

// Initialise slider thumb positions at rgb(255, 255, 255)
redSlider.stepUp(255);
greenSlider.stepUp(255);
blueSlider.stepUp(255);

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
canvas.addEventListener("click", e => {
  drawPixel(e);
  if (flags["startSelection"]) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    if (!selection["x1"]) {
      selection["x1"] = x;
      selection["y1"] = y;
      flags["selectionP1"] = true;
    } else if (!selection["x2"]) {
      selection["x2"] = x;
      selection["y2"] = y;
      flags["selectionP2"] = true;
    } else {
      makeSelection();
    }
  }
  if (flags["moveSelection"]) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    var imageData = selection["imageData"];
    ctx.clearRect(selection["x1"], selection["y1"], imageData.width, imageData.height);
    ctx.putImageData(imageData, x, y);
    selection = {"x1" : null, "y1" : null, "x2" : null, "y2" : null, "imageData" : null};
    flags["moveSelection"] = false;
    flags["startSelection"] = false;
  }
});
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
  if (ctx.lineWidth > 1) ctx.lineWidth -= 10;
});

var increaseBrushSizeButton = document.querySelector("#increaseBrushSize");
increaseBrushSizeButton.addEventListener("click", e => {
  ctx.lineWidth += 10;
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

var addImageFromURLButton = document.querySelector("#addURLImage");
addImageFromURLButton.addEventListener("click", addImageFromURL);

function addImageFromURL() {
  var URL = prompt("Enter the URL of the image:");
  var image = new Image();
  image.src = URL;
  image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
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

var selectionButton = document.querySelector("#selection");
selectionButton.addEventListener("click", makeSelection);

function makeSelection() {
  flags["startSelection"] = !flags["startSelection"];
  
  // If the selection is complete:
  if (!flags["startSelection"]) {
    var x = selection["x1"];
    var y = selection["y1"];
    var width = selection["x2"] - selection["x1"];
    var height = selection["y2"] - selection["y1"];
    selection["imageData"] = ctx.getImageData(x, y, width, height);
  }
}

var moveSelectionButton = document.querySelector("#moveSelection");
moveSelectionButton.addEventListener("click", moveSelection);

function moveSelection() {
  flags["moveSelection"] = !flags["moveSelection"];
}

