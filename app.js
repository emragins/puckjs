//@ts-check

/*********************
 * 
 * Morse Code Thermometer
 * 
 * for Puck.js
 * 
 * ********************/


var showing = false;

const BLINK_GAP = 500;


const RED_LED = LED1;
const GREEN_LED = LED2;
const BLUE_LED = LED3;

// 0 = short, 1 = long
const MORSE_NUMBERS = {
  1: [0, 1, 1, 1, 1],
  2: [0, 0, 1, 1, 1],
  3: [0, 0, 0, 1, 1],
  4: [0, 0, 0, 0, 1],
  5: [0, 0, 0, 0, 0],
  6: [1, 0, 0, 0, 0],
  7: [1, 1, 0, 0, 0],
  8: [1, 1, 1, 0, 0],
  9: [1, 1, 1, 1, 0],
  0: [1, 1, 1, 1, 1],
};

function shortBlink(led) {
  digitalPulse(led, 1, 50);
}
function longBlink(led) {
  digitalPulse(led, 1, 500);
}

function writeMorse(isShort, led) {
  if (isShort) {
    shortBlink(led);
  } else {
    longBlink(led);
  }
}

/**
 * Write (blink) a number in morse code
 *  
 * @param {number} number ordinal number, single digit
 * @param {*} led reference to LED
 * @returns {number} time in ms that will have elapsed when this number is done
 */
function writeNumber(number, led) {
  var morse = MORSE_NUMBERS[number];

  const firstIsShort = !morse[0];
  const secondIsShort = !morse[1];
  const thirdIsShort = !morse[2];
  const fourthIsShort = !morse[3];
  const fifthIsShort = !morse[4];

  writeMorse(firstIsShort, led);
  var delay = BLINK_GAP + (firstIsShort ? 0 : 500);
  setTimeout(() => {
    writeMorse(secondIsShort, led);
  }, delay);

  delay = delay + BLINK_GAP + (secondIsShort ? 0 : 500);
  setTimeout(() => {
    writeMorse(thirdIsShort, led)
  }, delay);

  delay = delay + BLINK_GAP + (thirdIsShort ? 0 : 500);
  setTimeout(() => {
    writeMorse(fourthIsShort, led)
  }, delay);

  delay = delay + BLINK_GAP + (fourthIsShort ? 0 : 500);
  setTimeout(() => {
    writeMorse(fifthIsShort, led)
  }, delay);

  return delay + BLINK_GAP + (fifthIsShort ? 0 : 500);
}

/**
 * Show the temperature in blinks via morse code
 */
function showTemp() {
  if (!showing) {
    showing = true;

    // temp in celcius
    var temp = E.getTemperature();
    var tempF = Math.round((temp * 9) / 5 + 32);

    // truncate decimals
    tempF = Math.round(tempF * 10) / 10;

    // split into tens and ones
    var tens = Math.floor(tempF / 10);
    var ones = Math.floor(tempF % 10);


    var timeWillElapse = writeNumber(tens, RED_LED);
    setTimeout(() => {
      writeNumber(ones, GREEN_LED);
    }, timeWillElapse + 500);
  }

  showing = false;
}

setWatch(showTemp, BTN1, { repeat: true });
