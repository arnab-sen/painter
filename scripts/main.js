var dimensions = 25;
var mousedown = false;

function createGrid() {
  var gridContainer = document.querySelector(".grid-container");
  var gridItem;
  
  for (var i = 0; i < dimensions; i++) {
    for (var j = 0; j < dimensions; j++) {
      gridItem = document.createElement("div");
      gridItem.setAttribute("class", "grid-item");
      gridItem.setAttribute("id", `id-${i}-${j}`);
      gridItem.setAttribute("draggable", "false");
      //gridItem.textContent = gridItem.id;
      gridItem.style.padding = "10px";
      //gridItem.style.border = "1px solid";
      gridItem.addEventListener("mouseenter", e => {
        if (mousedown) e.target.style.backgroundColor = "black";
        });
      gridItem.addEventListener("mousedown", e => {mousedown = true; 
        e.target.style.backgroundColor = "black";
        })
      gridItem.addEventListener("mouseup", () => {mousedown = false;})
      gridContainer.appendChild(gridItem);
    }
  }
}

function resetGrid() {
  for (var i = 0; i < dimensions; i++) {
    for (var j = 0; j < dimensions; j++) {
      gridItem = document.querySelector(`#id-${i}-${j}`);
      gridItem.style.backgroundColor = "white";
    }
  }
}

function createResetButton () {
  var button = document.querySelector("#reset");
  button.addEventListener("click", e => {resetGrid();});
}

createGrid();
createResetButton();
