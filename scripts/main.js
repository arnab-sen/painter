
function createGrid() {
  var gridContainer = document.querySelector(".grid-container");
  var gridItem;
  
  for (var i = 0; i < dimensions; i++) {
    for (var j = 0; j < dimensions; j++) {
      gridItem = document.createElement("div");
      gridItem.setAttribute("class", "grid-item");
      gridItem.setAttribute("id", `id-${i}-${j}`);
      //gridItem.textContent = gridItem.id;
      gridItem.style.padding = "10px";
      //gridItem.style.border = "1px solid";
      gridItem.addEventListener("mouseover", e => {e.target.style.backgroundColor = "black";});
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

var dimensions = 25;
createGrid();
createResetButton();
