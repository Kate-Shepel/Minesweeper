export let startTime;
export let elapsedTime = 0;
export let timerInterval;

export function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(function () {
        let now = Date.now();
        elapsedTime = Math.round((now - startTime) / 1000); // convert milliseconds to seconds
        document.querySelector('.timer').innerHTML = elapsedTime;
    }, 1000); // update every second
}

export function getElapsedTime() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    return elapsedTime;
}

export function resetTimeVariables() {
    startTime = undefined;
    elapsedTime = 0;
}
