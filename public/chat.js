document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  // Get the selected shape, size, and position from the form inputs
  var shape = document.querySelector("input[name=shape]:checked").value;
  var size = document.querySelector("input[name=size]").value;
  var position = document.querySelector("input[name=position]").value;

  // Create a new shape component with the selected attributes
  var shapeComponent = document.createElement("a-" + shape);
  shapeComponent.setAttribute("radius", size);
  shapeComponent.setAttribute("height", size);
  shapeComponent.setAttribute("width", size);
  shapeComponent.setAttribute("depth", size);
  shapeComponent.setAttribute("position", position);
  
  console.log("Sould produce shape");

  // Add the new shape to the scene
  var scene = document.querySelector("a-scene");
  scene.appendChild(shapeComponent);

  // Add a click event listener to the new shape
  shapeComponent.addEventListener("click", async() => {
    shapeComponent.setAttribute("color", "red");
  })
})

