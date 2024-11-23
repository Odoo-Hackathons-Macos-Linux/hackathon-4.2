const socket = io();
const wait = document.getElementById("wait");
const newTurn = document.getElementById("newTurn");

let selectedCardID = "resources";
var turn = 0;

socket.on("newTurn", (currentTurn) => { 
  turn = currentTurn; 
  console.log("Received new turn");
  wait.classList.add("hidden");
  newTurn.classList.remove("hidden");

  let score = startTurn(); 
  
  setTimeout(() => {
    socket.emit("played", turn, correctedIDfun(selectedCardID));
    wait.classList.remove("hidden");
    newTurn.classList.add("hidden");
  }, 10000);  
})

// Cards design

function correctedIDfun(selectedCardID){
    if (selectedCardID == 'resources') {
        return 'water'
    } else if (selectedCardID == 'build') {
        return 'shleter'
    } else if (selectedCardID == 'exploration') {
        return 'water++'
    } else if (selectedCardID == 'technology') {
        return 'tools'
    }
    return selectedCardID
}

function startTurn() {
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
    const event_before = document.getElementById("event-before");
    const event_after = document.getElementById("event-now");
    const timebar = document.getElementById("timebar");

    let width = 0;
    let timerInterval;
    let totalTime = 0;
    let sectionDuration = 4.6; // Duration for each section in seconds
    let selectedGroupID = "resources";

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

    // Function to handle card selection
    function cardSelector(){
        cards.forEach((card) => {
        card.addEventListener("click", () => {
            cards.forEach((c) => c.classList.remove("bg-green-500"));
            card.classList.add("bg-green-500");

            // Set selected card ID globally when a card is clicked
            selectedCardID = card.id;
            console.log("Card clicked, selectedCardID:", selectedCardID);  // Log the selected card ID for debugging
        });
        });
    }

    // Move to the next step after card selection
    function switchToNextStep() {
        if (selectedCardID !== null) {
        selectedGroupID = selectedCardID
        mainCards.classList.add("hidden");

        // Hide all other menus and show the selected one
        Object.keys(menus).forEach((key) => {
            menus[key].classList.add("hidden");
        });
        menus[selectedGroupID]?.classList.remove("hidden");
        menus[selectedGroupID]?.classList.add("flex");

        // Start the timer for the end step
        startTimerEnd();
        }
    }

    function startTimerEnd() {
        clearInterval(timerInterval);
        totalTime = 0; 
        timerInterval = setInterval(() => {
        totalTime += 0.1; 
        width = (totalTime / sectionDuration) * 100; 
        progressBar.style.width = `${width}%`;

        if (width >= 100) {
            clearInterval(timerInterval);
            menus[selectedGroupID]?.classList.remove("flex");
            menus[selectedGroupID]?.classList.add("hidden");  
            timebar.classList.add("hidden");    
            event_before.classList.remove("max-w-[100px]");
            event_after.classList.remove("max-w-[100px]");  
            event_before.classList.add("max-w-[150px]");
            event_after.classList.add("max-w-[150px]");    
        }
        }, 100);
    }

    selectedCardID = 'resources'
    event_before.classList.remove("max-w-[150px]");
    event_after.classList.remove("max-w-[150px]");
    event_before.classList.add("max-w-[100px]");
    event_after.classList.add("max-w-[100px]");
    mainCards.classList.remove("hidden");
    mainCards.classList.add("flex");
    timebar.classList.remove("hidden");
    startTimer();
    cardSelector();

    return selectedCardID;  // Return the globally updated selectedCardID
}
