const socket = io();
const wait = document.getElementById("wait");
const newTurn = document.getElementById("newTurn");

let selectedCardID = "resources";
let turn = 0;

// Get or create a persistent unique user ID
let userId = localStorage.getItem("userId");
if (!userId) {
  // If userId doesn't exist, create one
  userId = generateUniqueId();
  localStorage.setItem("userId", userId);  // Store the ID for future use
}

// Function to generate a unique user ID (you can customize this logic)
function generateUniqueId() {
  return 'user-' + Math.random().toString(36).substr(2, 9); // Random ID format
}

console.log("User ID: " + userId);  // Print user ID to the console

let totalydead = localStorage.getItem("totalydead") == "true";  // Retrieve the stored death status from localStorage

socket.on("newTurn", (currentTurn) => {
    turn = currentTurn;

    // Check if the player is dead
    if (totalydead) {
        console.log("Player is dead, skipping turn");
        wait.classList.add("hidden");
        newTurn.classList.remove("hidden");
        startTurn("dead"); 
        return;  
    }

    console.log("Player is alive, continuing the game");

    wait.classList.add("hidden");
    newTurn.classList.remove("hidden");

    let status = ["alive", "sick", "dead"];
    let choice = getRandomElement(status);

    if (choice == "dead") {
        startTurn(choice);  // Handle turn when the player dies
        totalydead = true;  // Mark the player as dead
        localStorage.setItem("totalydead", "true");  // Store the death status in localStorage
        console.log("Character is dead now");

        socket.emit("played", userId, turn, correctedIDfun(selectedCardID));
    } else {
        startTurn(choice); 
        setTimeout(() => {
            socket.emit("played", userId, turn, correctedIDfun(selectedCardID));
            wait.classList.remove("hidden");
            newTurn.classList.add("hidden");
        }, 10000);  // Adjust the delay as necessary
    }
});

/**
 * Function to get a random element from an array
 */
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Card ID correction function
function correctedIDfun(selectedCardID) {
    if (selectedCardID == 'resources') {
        return 'water';
    } else if (selectedCardID == 'build') {
        return 'shelter';
    } else if (selectedCardID == 'exploration') {
        return 'water++';
    } else if (selectedCardID == 'technology') {
        return 'tools';
    }
    return selectedCardID;
}

function startTurn(status) {
    if (status == 'alive'){
        const progressBar = document.getElementById("timebar-progress");
        const life = document.getElementById("alive");
        const mainCards = document.getElementById("main-cards");
        const menus = {
            resources: document.getElementById("resources-cards"),
            build: document.getElementById("build-cards"),
            exploration: document.getElementById("exploration-cards"),
            technology: document.getElementById("technology-cards"),
        };
        const event_before = document.getElementById("event-before");
        const event_after = document.getElementById("event-now");
        const timebar = document.getElementById("timebar");

        if (!mainCards || !event_before || !event_after || !timebar) {
            console.error("One or more required DOM elements are missing!");
            return; // Exit the function early if critical elements are missing
        }

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
        function cardSelector() {
            const cards = document.querySelectorAll(".selectable-card");
            cards.forEach((card) => {
                card.addEventListener("click", () => {
                    cards.forEach((c) => c.classList.remove("bg-green-500"));
                    card.classList.add("bg-green-500");

                    selectedCardID = card.id;
                });
            });
        }

        // Move to the next step after card selection
        function switchToNextStep() {
            if (selectedCardID !== null) {
                selectedGroupID = selectedCardID;
                mainCards.classList.add("hidden");

                // Hide all other menus and show the selected one
                Object.keys(menus).forEach((key) => {
                    if (menus[key]) menus[key].classList.add("hidden");
                });
                if (menus[selectedGroupID]) {
                    menus[selectedGroupID]?.classList.remove("hidden");
                    menus[selectedGroupID]?.classList.add("flex");
                }

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
                    if (menus[selectedGroupID]) {
                        menus[selectedGroupID]?.classList.remove("flex");
                        menus[selectedGroupID]?.classList.add("hidden");  
                    }
                    timebar.classList.add("hidden");    
                    event_before.classList.remove("max-w-[100px]");
                    event_after.classList.remove("max-w-[100px]");  
                    event_before.classList.add("max-w-[150px]");
                    event_after.classList.add("max-w-[150px]");
                    life.classList.add("hidden")    
                }
            }, 100);
        }

        // Ensure the elements are present
        selectedCardID = 'resources';
        life.classList.remove("hidden")    
        event_before.classList.remove("max-w-[150px]");
        event_after.classList.remove("max-w-[150px]");
        event_before.classList.add("max-w-[100px]");
        event_after.classList.add("max-w-[100px]");

        mainCards.classList.remove("hidden");
        mainCards.classList.add("flex");
        timebar.classList.remove("hidden");

        startTimer();
        cardSelector();  // Enable card selection
        return selectedCardID;  // Return the globally updated selectedCardID
    } else if (status == "sick"){
        const sickness = document.getElementById("sick");
        const progressBar = document.getElementById("timebar-progress-sick");
        const sickCard = document.getElementById("sick-card");
        const event_before = document.getElementById("event-before-sick");
        const event_after = document.getElementById("event-now-sick");
        const timebar = document.getElementById("timebar-sick");

        if (!sickness || !event_before || !event_after || !timebar) {
            console.error("One or more required DOM elements are missing!");
            return; // Exit the function early if critical elements are missing
        }

        let width = 0;
        let timerInterval;
        let totalTime = 0;
        let Duration = 4.6 * 2; // Duration for each section in seconds

        function startTimer() {
            clearInterval(timerInterval);
            totalTime = 0; // Reset time each time we start the timer
            timerInterval = setInterval(() => {
                totalTime += 0.1; // Increment accumulated time by 0.1 second
                width = (totalTime / Duration) * 100; // Calculate the progress as a percentage
                progressBar.style.width = `${width}%`;

                // If the progress bar reaches 100%, stop the interval
                if (width >= 100) {
                    clearInterval(timerInterval);
                    sickness.classList.add("hidden")
                }
            }, 100);
        }

        sickness.classList.remove("hidden")
        event_before.classList.remove("max-w-[150px]");
        event_after.classList.remove("max-w-[150px]");
        event_before.classList.add("max-w-[100px]");
        event_after.classList.add("max-w-[100px]");

        sickCard.classList.remove("hidden");
        sickCard.classList.add("flex");
        timebar.classList.remove("hidden");

        startTimer();
        return "None";
    } else {
        const deadness = document.getElementById("dead");
        const deadCard = document.getElementById("dead-card");
        deadness.classList.remove("hidden");
        deadCard.classList.remove("hidden");
        deadCard.classList.add("flex");
    }
}
