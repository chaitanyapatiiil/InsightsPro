let startTime, updatedTime, difference, tInterval;
let running = false;
let lapTimes = [];
let graphCtx = document.getElementById('graphCanvas').getContext('2d');

document.getElementById('startStopBtn').addEventListener('click', startStop);
document.getElementById('lapBtn').addEventListener('click', lap);
document.getElementById('resetBtn').addEventListener('click', reset);

function startStop() {
    if (!running) {
        startTime = new Date().getTime() - (difference || 0);
        tInterval = setInterval(getShowTime, 10);
        running = true;
        document.getElementById('startStopBtn').innerHTML = "Stop";
    } else {
        clearInterval(tInterval);
        running = false;
        document.getElementById('startStopBtn').innerHTML = "Start";
    }
}

function reset() {
    clearInterval(tInterval);
    running = false;
    lapTimes = [];
    difference = 0;
    document.getElementById('startStopBtn').innerHTML = "Start";
    document.getElementById('minutes').innerHTML = "00";
    document.getElementById('seconds').innerHTML = "00";
    document.getElementById('milliseconds').innerHTML = "00";
    document.getElementById('lapsList').innerHTML = "";
    clearGraph();
}

function getShowTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;
    
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);

    document.getElementById('minutes').innerHTML = (minutes < 10) ? "0" + minutes : minutes;
    document.getElementById('seconds').innerHTML = (seconds < 10) ? "0" + seconds : seconds;
    document.getElementById('milliseconds').innerHTML = (milliseconds < 10) ? "0" + milliseconds : milliseconds;
}

function lap() {
    if (running) {
        let lapTime = difference;
        lapTimes.push(lapTime);

        let li = document.createElement('li');
        li.innerHTML = formatTime(lapTime);
        document.getElementById('lapsList').appendChild(li);

        updateGraph();
    }
}

function formatTime(time) {
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((time % 1000) / 10);
    
    return `${(minutes < 10) ? "0" + minutes : minutes}:${(seconds < 10) ? "0" + seconds : seconds}:${(milliseconds < 10) ? "0" + milliseconds : milliseconds}`;
}

function updateGraph() {
    clearGraph();
    graphCtx.beginPath();
    graphCtx.moveTo(0, graphCtx.canvas.height);
    
    lapTimes.forEach((lapTime, index) => {
        let x = (graphCtx.canvas.width / lapTimes.length) * index;
        let y = graphCtx.canvas.height - (lapTime / Math.max(...lapTimes) * graphCtx.canvas.height);
        graphCtx.lineTo(x, y);
        graphCtx.arc(x, y, 3, 0, 2 * Math.PI);
    });
    
    graphCtx.strokeStyle = '#000';
    graphCtx.stroke();
}

function clearGraph() {
    graphCtx.clearRect(0, 0, graphCtx.canvas.width, graphCtx.canvas.height);
}
