var overlay = document.getElementById("overlay");
  overlay.addEventListener("pointerdown", function(event) {
    event.stopPropagation(); // Prevent the A-Frame scene from receiving the event
  }, { passive: false });