let oilDrained = 0;
const maxOil = 500;
let simulationStarted = false;
let interval;

const valve1 = document.getElementById('valve1');
const valve2 = document.getElementById('valve2');
const valve3 = document.getElementById('valve3');
const alarm = document.getElementById('alarm');
const trip = document.getElementById('trip');
const relayFill = document.getElementById('relayFill');
const oilLevelSpan = document.getElementById('oilLevel');

// Initialize valves as OPEN (no .closed class)
valve1.dataset.open = "true";
valve2.dataset.open = "true";
valve3.dataset.open = "true";

function toggleValve(valve) {
    if (valve.dataset.open === 'true') {
        valve.dataset.open = 'false';
        valve.classList.add('closed');
    } else {
        valve.dataset.open = 'true';
        valve.classList.remove('closed');
    }
    checkStart();
}

function checkStart() {
    if (valve1.dataset.open === 'false' && valve2.dataset.open === 'false' && valve3.dataset.open === 'false') {
        if (!simulationStarted) {
            simulationStarted = true;
            startDrain();
        }
    }
}

function startDrain() {
    clearInterval(interval);
    interval = setInterval(() => {
        if (oilDrained < maxOil) {
            oilDrained += 10; // Severe fault drains faster
            if (oilDrained > maxOil) oilDrained = maxOil;
            updateDisplay();
        } else {
            clearInterval(interval);
        }
    }, 50);
}

function updateDisplay() {
    const relayPercent = ((maxOil - oilDrained) / maxOil) * 100;
    relayFill.style.height = `${relayPercent}%`;
    oilLevelSpan.textContent = oilDrained;

    // Alarm logic
    if (oilDrained > 100) {
        alarm.classList.add('alarm-on');
    } else {
        alarm.classList.remove('alarm-on');
    }

    // Trip logic
    if (oilDrained > 300) {
        trip.classList.add('trip-on');
    } else {
        trip.classList.remove('trip-on');
    }
}

function resetAll() {
    oilDrained = 0;
    simulationStarted = false;
    relayFill.style.height = '100%';
    oilLevelSpan.textContent = 0;
    alarm.classList.remove('alarm-on');
    if (trip) trip.classList.remove('trip-on');

    [valve1, valve2, valve3].forEach(v => {
        v.dataset.open = 'true';
        v.classList.remove('closed');
    });

    clearInterval(interval);
}

