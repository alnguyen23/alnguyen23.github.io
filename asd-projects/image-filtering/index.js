// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads and is where you should call your functions.
$(document).ready(function(){
    const $display = $('#display');

    // TODO: Call your apply function(s) here
    applyFilterNoBackground(reddify);
    applyFilterNoBackground(decreaseBlue);
    applyFilterNoBackground(increaseGreenByBlue);

    render($display, image);
});

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////

// TODO 1 & 3: Create the applyFilter function here
// this function applies filters
function applyFilter(filterFunction) {
   for (var r = 0; r <= image.length - 1; r++) {
      for (var c = 0; c < image[r].length; c++) {
          var rgbString = image[r][c];
          var rgbNumbers = rgbStringToArray(rgbString);
            filterFunction(rgbNumbers);
            rgbString = rgbArrayToString(rgbNumbers);
            image[r][c] = rgbString;
      }
   }
}

// TODO 5: Create the applyFilterNoBackground function
// this function adds the filters with no changes to the background
function applyFilterNoBackground(filterFunction) {
   for (var r = 0; r <= image.length - 1; r++) {
      for (var c = 0; c < image[r].length; c++) {
          var rgbString = image[r][c];
          var rgbNumbers = rgbStringToArray(rgbString);

          // uses background color as a reference and goes through to each color
          // if previous color was 150 before filter, then the color changes back to the background color
          var backgroundColorString = image[1][1];
          var backgroundColorNum = rgbStringToArray(backgroundColorString);
          if (rgbNumbers[RED] === backgroundColorNum[RED] &&
              rgbNumbers[GREEN] === backgroundColorNum[GREEN] &&
              rgbNumbers[BLUE] === backgroundColorNum[BLUE]) {
                rgbString = rgbArrayToString(rgbNumbers);
                image[r][c] = rgbString;

          // else, the color stays the same and does not revert
          } else {
              filterFunction(rgbNumbers);
              rgbString = rgbArrayToString(rgbNumbers);
              image[r][c] = rgbString;
          }
      }
   }
}

// TODO 2 & 4: Create filter functions
// reddify makes the image redder (uses its maximum value)
function reddify(arr) {
   arr[RED] = 225;
}

// decreaseBlue decreases the amount of blue in the image by 30
function decreaseBlue(arr) {
   arr[BLUE] = arr[BLUE] - 30;
   arr[BLUE] = Math.max(arr[BLUE], 0);
}

// increaseGreenByBlue increases the green of the image by adding the blue
function increaseGreenByBlue(arr) {
   arr[GREEN] = arr[BLUE] + arr[GREEN];
   arr[GREEN] = Math.min(arr[GREEN], 255);
}

// CHALLENGE code goes below here
