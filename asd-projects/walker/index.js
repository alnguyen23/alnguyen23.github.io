/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var KEY = {
      "LEFT": 37, //left arrow key
      "UP": 38, //up arrow key
      "RIGHT": 39, //right arrow key
      "DOWN": 40, //down arrow key
      "W": 87,//up
      "A": 65,//left
      "S": 83,//down
      "D": 68 //right
  }; //Magic numbers are eliminated because of hard-coded values for keys

  //board variables (to keep box inside board)
  var boardWidth = $("#board").width();
  var boardHeight = $("#board").height();

  // Game Item Objects
  //box 1 variables
  var positionX = 0;
  var positionY = 0;
  var speedX = 0;
  var speedY = 0;

  //box 2 variables
  var positionX2 = 0;
  var positionY2 = 60;
  var speedX2 = 0;
  var speedY2 = 0;

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on("keydown", handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  $(document).on("keyup", handleKeyUp);

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    //repositions the box depending on speedX and speedY
    repositionBox();
    //Fixes horizontal position and prevents box from going outside bounds
    if (positionX > boardWidth - 50) {
        speedX = speedX * -1;
    } else if (positionX < 0) {
        speedX = speedX * -1;
    }
     //Fixes vertical position and prevents box from going outside bounds
    if (positionY > boardHeight - 50) {
        speedY = speedY * -1;
    } else if (positionY < 0) {
        speedY = speedY * -1;
    }
    //redraws box using CSS after figuring out the new position
    redrawBox();

    //repositioning and redrawing for box 2
    repositionBox2();
    if (positionX2 > boardWidth - 50) {
        speedX2 = speedX2 * -1;
    } else if (positionX2 < 0) {
        speedX2 = speedX2 * -1;
    }
    //Fixes vertical position and prevents box from going outside bounds
    if (positionY2 > boardHeight - 50) {
        speedY2 = speedY2 * -1;
    } else if (positionY2 < 0) {
        speedY2 = speedY2 * -1;
    }
    redrawBox2();
  }

  /* 
  Called in response to events.
  */

  //Controls when box stops (upon release of arrow key)
  function handleKeyUp(event) {
    speedX = 0;
    speedY = 0;
    speedX2 = 0;
    speedY2 = 0;
  }

  //Controls box movement depending on key press
  function handleKeyDown(event) {
    if (event.which === KEY.LEFT) {
        speedX = -5; //going left moves in the negative direction
    } else if (event.which === KEY.RIGHT) {
        speedX = 5; //going right moves in the positive direction
    } else if (event.which === KEY.UP) {
        speedY = -5; //going up moves in the negative direction (relative to top, going up is negative)
    } else if (event.which === KEY.DOWN) {
        speedY = 5; //going down moves in the positive direction (relative to top, going down is positive)
    }
    //CONTROLS FOR BOX 2
    if (event.which === KEY.A) {
        speedX2 = -5; //A -> left key
        console.log("key a was pressed");
    } else if (event.which === KEY.D) {
        speedX2 = 5; //D -> right key
        console.log("key d was pressed");
    } else if (event.which === KEY.W) {
        speedY2 = -5; //W -> up key
        console.log("key w was pressed");
    } else if (event.which === KEY.S) {
        speedY2 = 5; //S -> down key
        console.log("key s was pressed");
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  //Repositions box using position and speed
  function repositionBox() {
     positionX += speedX; //horizontal position of box updates
     positionY += speedY; //vertical position of box updates
  } 
  //Redraws the box in new position using the new positionX and positionY
  function redrawBox() {
     $("#box").css("left", positionX); //draws box in new position using positionX as a new starting point
     $("#box").css("top", positionY); //draws box in new position using positionY as a new starting point
  }
  
  //BOX 2 REPOSITIONING AND REDRAWING
  function redrawBox2() {
     positionX2 += speedX2; //horizontal position of box 2 updates
     positionY2 += speedY2; //vertical position of box 2 updates
  }

  function repositionBox2() {
     $("#box2").css("left", positionX2); //draws box in new position using positionX as a new starting point
     $("#box2").css("top", positionY2); //draws box in new position using positionY as a new starting point
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
