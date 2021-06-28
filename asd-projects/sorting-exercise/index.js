/* IMPORTANT VALUES

This section contains a list of all variables predefined for you to use (that you will need)

The CSS ids you will work with are:

1. bubbleCounter -- the container for the counter text for bubble sort
2. quickCounter  -- the container for the counter text for quick sort

*/

///////////////////////////////////////////////////////////////////////
/////////////////////// YOUR WORK GOES BELOW HERE /////////////////////
///////////////////////////////////////////////////////////////////////

// TODO 2: Implement bubbleSort
async function bubbleSort(array) {
    // declares that the sorting is false
    var sorted = false;
    // starts while statement that says while sorted is false, two loops occur:
    while (!sorted) {
        // one loops regularly
        for (var i = 0; i < array.length; i++) {
            // the has a higher index and compares itself to the other loop 
            // if its value is less than that of the other loop, the two have to swap
            for (var j = i + 1; j < array.length; j++) {
                if (array[i].value > array[j].value) {
                    swap(array, i, j);
                    sorted = false;
                    updateCounter(bubbleCounter);
                    await sleep();
                }
            }
        }
    }
}

// TODO 3: Implement quickSort
async function quickSort(array, left, right) {
    // if the array length it greater than 1, partition is called
    if (array.length > 1) {
        var index = await partition(array, left, right);
        // once partition is called, quickSort compares the left and right indexes
        // to see if there are two or more unsorted elements
        if (left < index - 1) {
          await quickSort(array, left, index - 1);
        }
        if (right > index) {
          await quickSort(array, index, right);
        }
    }
}

// TODOs 4 & 5: Implement partition
async function partition(array, left, right) {
    // randomly decides a pivot
    var pivot = array[Math.floor((right + left)/2)].value;
    // while left is less than right, the following code runs:
    while (left < right) {
        // while the left's value is less than pivot, the left is increased by 1
        while (array[left].value < pivot) {
            left = left + 1;
        }
        // while the right's value is less than pivot, the right is decreased by 1
        while (array[right].value > pivot) {
            right = right - 1;
        }
        // the two inner while loops make is possible that left and right eventually 
        // even out; however, if left is less than right, a swap occurs
        if (left < right) {
            swap(array, left, right);
            updateCounter(quickCounter);
            await sleep();
        }
    }
    // left + 1 is returned to quickSwap
    return left + 1;
}

// TODO 1: Implement swap
function swap(array, i, j) {
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    drawSwap(array, i, j);
}

///////////////////////////////////////////////////////////////////////
/////////////////////// YOUR WORK GOES ABOVE HERE /////////////////////
///////////////////////////////////////////////////////////////////////

//////////////////////////// HELPER FUNCTIONS /////////////////////////

// this function makes the program pause by SLEEP_AMOUNT milliseconds whenever it is called
function sleep(){
    return new Promise(resolve => setTimeout(resolve, SLEEP_AMOUNT));
}

// This function draws the swap on the screen
function drawSwap(array, i, j){
    let element1 = array[i];
    let element2 = array[j];

    let shiftIncrement = $(bubbleId).height()/MAX_SQUARES;
    let shiftAmount = (i - j) * shiftIncrement;

    $(element1.id).css("top", parseFloat($(element1.id).css("top")) + shiftAmount + "px");
    $(element2.id).css("top", parseFloat($(element2.id).css("top")) - shiftAmount + "px");
}

// This function updates the specified counter
function updateCounter(counter){
    $(counter).text("Move Count: " + (parseFloat($(counter).text().replace(/^\D+/g, '')) + 1));
}