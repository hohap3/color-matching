import { getReplayButton , getTimerElement  } from './selectors.js'

function shuffleIndex(arr) {
  if(!Array.isArray(arr) || arr.length < 3) return;

  const ARR_LENGTH = arr.length;
  for(let i = ARR_LENGTH - 1 ;i>1 ;i--) {
    const randomIndex = Math.floor(Math.random() * ARR_LENGTH);

    // Swap value by index
    [arr[randomIndex],arr[i]] = [arr[i],arr[randomIndex]]
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  // Check initial value
  if(typeof count !== 'number') return;

  const tempColorList = [];
  const hueColors = ['red','orange','yellow','green','blue','purple','pink','monochrome'];

  for(let i = 0 ;i<count ;i++) {
    const color = randomColor({
      luminosity:'dark',
      hue:hueColors[i % hueColors.length]
    })
    tempColorList.push(color);
  }

  const colorList = [...tempColorList,...tempColorList];
  // Shuffle colorList => random index color
  shuffleIndex(colorList);
  return colorList;
}

export function showReplayButton() {
  const replayButton = getReplayButton();
  if(replayButton) replayButton.classList.add('show');
}

export function hideReplayButton() {
  const replayButton = getReplayButton();
  if(replayButton) replayButton.classList.remove('show');
}

export function setTimer(mess) {
  const timerElement = getTimerElement();
  if(timerElement) timerElement.textContent = mess;
}

// Count down timer
export function createTimer({ seconds , onChange , onFinish }) {

  let intervalID;

  function start() {
    clear();

    let currentSecond = seconds;

    intervalID = setInterval(() => {

      if(onChange) onChange(currentSecond);

      currentSecond--;

      if(currentSecond < 0) {
        clear();
        if(onFinish) onFinish();
      }
    },1000)
  }

  function clear() {
    if(intervalID) clearInterval(intervalID);
  }

  return {
    start,
    clear
  }
}