import { GAME_STATUS , PAIRS_COUNT , GAME_TIME } from './constants.js'
import { 
  getColorElementList,
  getTimerElement,
  getPlayAgainButton,
  getColorBackground,
  getColorListElement,
  getInactiveColorElementList,
  getReplayButton
} from './selectors.js'

import { 
  getRandomColorPairs, 
  showReplayButton,
  hideReplayButton,
  setTimer,
  createTimer
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
  seconds:GAME_TIME,
  onChange:handleTimerChange,
  onFinish:handleTimerFinish,
})

function handleTimerChange(second) {
  let time = `0${second}`.slice(-2);
  setTimer(`${time}s`);
}

function handleTimerFinish() {
  // Update game status
  // Set message
  // Show replay button
  gameStatus = GAME_STATUS.FINISHED;
  setTimer('Game Over');
  showReplayButton();
}


// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function initColorElement() {
  const colorElementList = getColorElementList();
  if(colorElementList.length < 1) return;

  const colorList = getRandomColorPairs(PAIRS_COUNT);
  colorElementList.forEach((colorElement,index) => {
    colorElement.dataset.color = colorList[index];
    const overlayElement = colorElement.querySelector('.overlay');
    if(overlayElement) overlayElement.style.backgroundColor = colorList[index];
  })
}

function updateColorBackground(color) {
  const colorBackground = getColorBackground();
  if(colorBackground) colorBackground.style.backgroundColor = color;
}

function resetBackgroundColor() {
  const colorBackground = getColorBackground();
  if(colorBackground) colorBackground.style.backgroundColor = 'goldenrod';
}

function handleClickEvent(colorElement) {

  // Check if colorElement has been clicked
  const isClicked = colorElement.classList.contains('active');
  // Check if game status is blocking or finished
  const isBlocked = [GAME_STATUS.BLOCKING,GAME_STATUS.FINISHED].includes(gameStatus);
  if(isClicked || isBlocked) return;

  colorElement.classList.add('active');

  // Check if colors is match
  selections.push(colorElement);
  if(selections.length < 2) return;

  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firstColor === secondColor;

  if(isMatch) {
    // Update color background if it matched
    updateColorBackground(firstColor);

    // If the game is finished or it won
    const isWon = getInactiveColorElementList().length === 0;
    if(isWon) {
      // Show replay button
      // Update game status
      // Show message
      showReplayButton();
      gameStatus = GAME_STATUS.FINISHED;
      timer.clear();
      setTimer('You Win');
    }
    // Reset selections
    selections = [];
    return;
  }
  // Blocking -> to avoid selections have more than 2 value

  gameStatus = GAME_STATUS.BLOCKING;

  // If selections color is not match
  setTimeout(() => {
    selections[0].classList.remove('active');
    selections[1].classList.remove('active');

    if(gameStatus !== GAME_STATUS.PLAYING)
      gameStatus = GAME_STATUS.PLAYING;

    // Reset selections
    selections = [];
  },550)

}

function initClickEvent() {
  const colorListElement = getColorListElement();
  if(!colorListElement) return;

  colorListElement.addEventListener('click',(e) => {
    const colorElement = e.target.closest('li[data-color]');
    if(!colorElement) return;
    handleClickEvent(colorElement);
  })
}

function removeActiveClassColorElement() {
  const colorElementList = getColorElementList();
  if(colorElementList.length < 1) return;
  colorElementList.forEach(colorElement => {
    colorElement.className = '';
  })
}

function handleReplayEvent() {

  // Reset Global Variable
  selections = [];
  gameStatus = GAME_STATUS.PLAYING;

  // Update DOM -> remove active class in colorElement
  removeActiveClassColorElement();

  // Generate a new colorList
  initColorElement();

  // Hide message
  setTimer('');
  timer.start(); //Start timer again

  // Reset background color to default
  resetBackgroundColor();

  // Hide replay button
  hideReplayButton();

}

function initReplayEvent() {
  const replayButton = getReplayButton();
  if(!replayButton) return;

  replayButton.addEventListener('click',handleReplayEvent);
}

function initTimer() {
  timer.start();
}

// main
(() => {

  // init timer
  initTimer();

  //init color Element
  initColorElement(); 

  // init click event
  initClickEvent();

  // init replay button
  initReplayEvent();
})();