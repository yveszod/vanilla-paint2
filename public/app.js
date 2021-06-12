/*
 * Print Check
 */
console.log('App JS initialized');
/*
 * I'm making Sure that DOM was loaded before the events are checked
 */
document.addEventListener("DOMContentLoaded", function() {

  printImages();
  // Assign initial Vars, so proper values are displayed
  setBrushColors(document.getElementById('brushColor').value); // Color
  setBrushSize(document.getElementById('brushSize').value); // Size
  const canvas = document.getElementById("paintCanvas");
  const ctx = canvas.getContext("2d");

  /*
   * As I've had Trouble finding a working Vue/Angular Solution, I've decided to try with Vanilla for now.
   * If this is the version submitted - Assume I did not find a properly working solution.
   * Source - https://codepen.io/ciprian/pen/GncIm (adjustments were made)
   */

  function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function mouseMove(evt) {
    let mousePos = getMousePos(canvas, evt);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
  }

  canvas.addEventListener("mousedown", (evt) => {
    let mousePos = getMousePos(canvas, evt);
    ctx.beginPath();
    ctx.moveTo(mousePos.x, mousePos.y);
    evt.preventDefault();
    canvas.addEventListener("mousemove", mouseMove, false);
  });

  canvas.addEventListener(
    "mouseup",
    () => {
      canvas.removeEventListener("mousemove", mouseMove, false);
    },
    false
  );
  canvas.addEventListener(
    "mousemove",
    (e) => {
      document.getElementById('pos_x').innerHTML = e.offsetX;
      document.getElementById('pos_y').innerHTML = e.offsetY;
    },
    false
  );

  document.getElementById("clearBtn").addEventListener(
    "click",
    () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    false
  );

  /*
   * Brush COLOR
   */

  document.getElementById('brushColor').addEventListener(
    "change",
    () => {
      let brushValue = document.getElementById('brushColor').value;
      setBrushColors(brushValue);
      ctx.strokeStyle = brushValue;
    },
    false
  );

  /*
   * Brush SIZE
   */

  document.getElementById('brushSize').addEventListener(
    "change",
    () => {
      let brushValue = document.getElementById('brushSize').value;
      setBrushSize(brushValue);
      ctx.lineWidth = document.getElementById('brushSize').value;
    },
    false
  );

  /*
   * Canvas BG
   */

  document.getElementById('bgColor').addEventListener(
    "change",
    () => {
      /*
       * Source - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
       */
      ctx.fillStyle = document.getElementById('bgColor').value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    false
  );

  /*
   * Functions
   */
  function setBrushColors(value) {
    document.getElementById('brushColorVal').innerHTML = 'Brush Color: ' + value;
  }

  function setBrushSize(value) {
    document.getElementById('brushSizeVal').innerHTML = 'Brush Size: ' + value;
  }

});
/*
 * Handling Image Saving
 */

function saveImg() {
  var can = document.getElementById('paintCanvas');
  var ctx = can.getContext('2d');

  var img = new Image();
  img.src = can.toDataURL();
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/images', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    src: can.toDataURL(),
  }));
  // Artificial Delay for the Images JSON To be updated. Otherwise this is executed before the file stored new Data.
  setTimeout(printImages, 500);
}

/*
 * Render Existing Images
 */
function printImages() {
  let imageList = document.getElementById('imagesList');
  imageList.innerHTML = '';
  fetch('/images').then(function(response) {
    return response.json();
  }).then(function(data) {
    data.forEach(function(value, key) {
      var img = new Image();
      img.src = value.src;
      imageList.appendChild(img);
    });
  }).catch(function(err) {
    console.warn('Something went wrong.', err);
  });
}

/*
 * Clear all images
 */
function clearAllImgs() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/images/delete', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  // Artificial Delay for the Images JSON To be updated. Otherwise this is executed before the file stored new Data.
  setTimeout(printImages, 500);
}
/*
 * Image Upload
 */
function uploadImage() {
  // Upload Image (or possible use it as raw PNG Data), and set it as Background for the Canvas.
  // I assume since we are not storing on server, the src attribute will be used instead of URL
  // Possible Solution - https://stackoverflow.com/questions/3868259/importing-image-on-canvas-html5
}
/*
  * Image Click
*/
function clickImportToCanvas(src){
  // I Assume I'm using the PNG's src data to embed as background in the canvas
}
