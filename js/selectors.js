export function getColorElementList() {
  return document.querySelectorAll('#colorList > li')
}

export function getTimerElement() {
  return document.querySelector('.game .game__timer')
}

export function getPlayAgainButton() {
  return document.querySelector('.game .game__button')
}

export function getColorBackground() {
  return document.querySelector('.color-background')
}

export function getColorListElement() {
  return document.getElementById('colorList');
}

export function getInactiveColorElementList() {
  return document.querySelectorAll('#colorList > li:not(.active)');
}

export function getReplayButton() {
  return document.querySelector('.game__button-wrapper > .game__button');
}