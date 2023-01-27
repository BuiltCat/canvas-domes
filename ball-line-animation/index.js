const canvas = document.querySelector('#canvas')
const operate = document.querySelector('#operate')
const canvasElement = document.querySelector('#canvasElem')

let length = 500
let number = 2
let radius = 10
let speed = 2
let ballColor = '#90EE90'
let lineColor = '#90EE90'

function resize() {
    canvasElement.height = Math.floor(document.body.clientHeight * 0.15 + 422);
    canvas.style.height = `${canvasElement.height}px`;
    document.querySelector('#operate').style.height = `${844 - canvasElement.height}px`
    operate.style.display = 'flex'
}

window.onload = resize
window.onresize = resize

const ballLineAnimation = new BallLineAnimation(
    canvasElement, number, radius, speed, ballColor, length, lineColor)

function changeRadius(value) {
    radius = (radius + value) || 1
    document.querySelector('#radius').innerHTML = radius
    ballLineAnimation.changeRadius(radius)
}
function changeSpeed(value) {
    speed = (speed + value) || 1
    document.querySelector('#speed').innerHTML = speed
    ballLineAnimation.changeSpeed(speed)
}
function changeNumber(value) {
    number = (number + value) || 1
    console.log(number)
    document.querySelector('#number').innerHTML = number
    ballLineAnimation.changeNumber(number)
}
function changeLength(value) {
    length = (length + value) || 1
    document.querySelector('#length').innerHTML = length
    ballLineAnimation.changeLength(length)
}
document.querySelector('#ballColor').addEventListener('input', e => {
    ballLineAnimation.changeBallColor(e.target.value)

})
document.querySelector('#lineColor').addEventListener('input', e => {
    ballLineAnimation.changeLineColor(e.target.value)

})