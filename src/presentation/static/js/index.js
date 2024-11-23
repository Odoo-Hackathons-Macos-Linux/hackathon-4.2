const socket = io();
const wait = document.getElementById("wait");
const newTurn = document.getElementById("newTurn");

var turn = 0;

socket.on("newTurn", (t) => {
  turn = t;
  console.log("Received new turn");
  wait.classList.add("hidden");
  newTurn.classList.remove("hidden");

  setTimeout(() => {
    console.log("Sending my result");
    socket.emit("played", turn, Math.floor(Math.random() * 4));
    wait.classList.remove("hidden");
    newTurn.classList.add("hidden");
  }, 10000);
})

// Cards design

const progressBar = document.getElementById("timebar-progress");
const customEvent = document.getElementById("custom-event");

const mainCards = document.getElementById("main-cards");
const menus = {
    resources: document.getElementById("resources-cards"),
    build: document.getElementById("build-cards"),
    exploration: document.getElementById("exploration-cards"),
    technology: document.getElementById("technology-cards"),
};
const cards = document.querySelectorAll(".selectable-card");

let selectedCardID = "resources";
let width = 0;
let timerInterval;
let totalTime = 0; // Total accumulated time in seconds
let sectionDuration = 7; // Duration for each section in seconds

// Function to start the timer
function startTimer() {
    clearInterval(timerInterval);
    totalTime = 0; // Reset time each time we start the timer
    timerInterval = setInterval(() => {
    totalTime += 0.1; // Increment accumulated time by 0.1 second
    width = (totalTime / sectionDuration) * 100; // Calculate the progress as a percentage
    progressBar.style.width = `${width}%`;

    // If the progress bar reaches 100%, stop the interval
    if (width >= 100) {
        clearInterval(timerInterval);
        switchToNextStep();
    }
    }, 100); // Update every 100ms
}

setTimeout(() => {
    document.getElementById("timebar").classList.remove("hidden");
    document.getElementById("event-before").classList.remove("max-w-[150px]");
    document.getElementById("event-now").classList.remove("max-w-[150px]");
    document.getElementById("event-before").classList.add("max-w-[100px]");
    document.getElementById("event-now").classList.add("max-w-[100px]");
    mainCards.classList.remove("hidden");
    mainCards.classList.add("flex");
    startTimer();
    cardSelector();
}, 700);

function cardSelector(){
    cards.forEach((card) => {
    card.addEventListener("click", () => {
        cards.forEach((c) => c.classList.remove("bg-green-500"));
        card.classList.add("bg-green-500");

        // Set selected card ID
        selectedCardID = card.id;
    });
    });
}

function switchToNextStep() {
    if (selectedCardID !== null) {
    mainCards.classList.add("hidden");

    // Hide all other menus and show the selected one
    Object.keys(menus).forEach((key) => {
        menus[key].classList.add("hidden");
    });
    menus[selectedCardID]?.classList.remove("hidden");
    menus[selectedCardID]?.classList.add("flex");

    // Start the timer
    startTimerEnd();
    }
}

function startTimerEnd() {
    clearInterval(timerInterval); // Clear any existing intervals
    totalTime = 0; // Reset time each time we start the timer
    timerInterval = setInterval(() => {
    totalTime += 0.1; // Increment accumulated time by 0.1 second
    width = (totalTime / sectionDuration) * 100; // Calculate the progress as a percentage
    progressBar.style.width = `${width}%`;

    // If the progress bar has reached 100%, stop the interval
    if (width >= 100) {
        clearInterval(timerInterval);
        sendDataSocket();
    }
    }, 100); // Update every 100ms
}

function sendDataSocket() {
    if (selectedCardID !== null) {
    console.log(selectedCardID);

    // Send data
    }
}