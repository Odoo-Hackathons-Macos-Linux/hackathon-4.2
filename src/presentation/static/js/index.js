const socket = io();
const wait = document.getElementById("wait");
const newTurn = document.getElementById("newTurn");

let selectedCardID = 1;
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

socket.on("newTurn", (currentTurn, data, playersStats) => {
  turn = currentTurn;
  if (!playersStats[userId]) {
    choice = "alive";
  } else {
    choice = playersStats[userId].status;
  }
  // Check if the player is dead
  if (totalydead && playersStats[userId]) {
    console.log("Player is dead, skipping turn");
    wait.classList.add("hidden");
    newTurn.classList.remove("hidden");
    startTurn("dead", data);
    return;
  } else {
    totalydead = false;
    localStorage.setItem("totalydead", "false");
    const deadness = document.getElementById("dead");
    const deadCard = document.getElementById("dead-card");
    deadness.classList.add("hidden");
    deadCard.classList.add("hidden");
    deadCard.classList.remove("flex");
  }
  console.log("Player is alive, continuing the game");

  wait.classList.add("hidden");
  newTurn.classList.remove("hidden");
  if (choice == "dead") {
    startTurn(choice, data);
    totalydead = true;
    localStorage.setItem("totalydead", "true");
    console.log("Character is dead now");
  } else if (choice == "sick") {
    startTurn(choice, data);
    setTimeout(() => {
      wait.classList.remove("hidden");
      newTurn.classList.add("hidden");
    }, 15000);
  } else if (choice == "kidnapped") {
    startTurn(choice, data);
    setTimeout(() => {
      wait.classList.remove("hidden");
      newTurn.classList.add("hidden");
    }, 15000);
  } else {
    startTurn(choice, data);
    setTimeout(() => {
      socket.emit("played", userId, turn, correctedIDfun(selectedCardID));
      wait.classList.remove("hidden");
      newTurn.classList.add("hidden");
    }, 15000);
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
  if (selectedCardID == null) {
    return 1;
  }
  return selectedCardID;
}

function startTurn(status, data) {
  if (status == 'alive') {
    const progressBar = document.getElementById("timebar-progress");
    const life = document.getElementById("alive");
    const parentContainer = document.getElementById("category-container");
    const nextContainer = document.getElementById("next-container");
    const event_before = document.getElementById("event-before");
    const event_after = document.getElementById("event-now");
    const timebar = document.getElementById("timebar");

    if (!parentContainer || !event_before || !event_after || !timebar || !nextContainer) {
      console.error("One or more required DOM elements are missing!");
      return;
    }

    let width = 0;
    let timerInterval;
    let totalTime = 0;
    let sectionDuration = 6.9; // Timer duration in seconds
    let selectedGroupID = 1;

    // Step 1: Create unique categories dynamically
    let category = data.map((x) => ({ id: x.category_id, image: x.category_image }))
      .reduce((acc, item) => {
        if (!acc.some((x) => x.id === item.id)) {
          acc.push(item);
        }
        return acc;
      }, []);

    // Populate category elements dynamically
    function displayCategories() {
      parentContainer.innerHTML = ""; // Clear previous items
      category.forEach((item) => {
        const div = document.createElement("div");
        div.id = item.id;
        div.className =
          "selectable-card w-[calc(50%-1rem)] max-w-[130px] min-w-[100px] min-h-[100px] bg-white shadow rounded-lg p-1 cursor-pointer";

        const img = document.createElement("img");
        if (item.image) {
          img.src = "/img/" + item.image;
        }
        img.className = "rounded-lg";

        div.appendChild(img);
        parentContainer.appendChild(div);

        // Add click listener to handle selection
        div.addEventListener("click", () => {
          document.querySelectorAll(".selectable-card").forEach((card) => {
            card.classList.remove("bg-green-500");
            div.classList.add("bg-white")
          });
          div.classList.remove("bg-white")
          div.classList.add("bg-green-500");

          // Store selected category ID
          selectedGroupID = item.id;
        });
      });
      // Make sure the container is visible and timer starts
      parentContainer.classList.remove("hidden");
      parentContainer.classList.add("flex");
      nextContainer.classList.add("hidden");
      timebar.classList.remove("hidden");
      startTimer();
    }

    // Step 2: Display Filtered Data
    function displayFilteredData(groupID) {
      const filteredData = data.filter((x) => x.category_id === groupID);
      if (filteredData.length === 0) {
        console.error(`No data found for category ID ${groupID}`);
        return;
      }
      nextContainer.innerHTML = ""; // Clear previous items
      filteredData.forEach((item) => {
        const div = document.createElement("div");
        div.id = item.choice_id;
        div.className =
          "selectable-card w-[calc(50%-1rem)] max-w-[130px] min-w-[100px] min-h-[100px] bg-white shadow rounded-lg p-1 cursor-pointer";

        const img = document.createElement("img");
        if (item.choice_image) {
          img.src = "/img/" + item.choice_image;
        }
        img.className = "rounded-lg";

        div.appendChild(img);
        nextContainer.appendChild(div);
        // Add click listener to handle selection
        div.addEventListener("click", () => {
          document.querySelectorAll(".selectable-card").forEach((card) => {
            card.classList.remove("bg-green-500");
            div.classList.add("bg-white")
          });
          div.classList.remove("bg-white")
          div.classList.add("bg-green-500");
          // Store selected category ID
          selectedCardID = item.choice_id;
        });
      });

      // Switch visibility between containers
      parentContainer.classList.add("hidden");
      nextContainer.classList.remove("hidden");
      nextContainer.classList.add("flex");

      // Start a new timer for the filtered data view
      startEndTimer(() => {
        console.log("Filtered data step complete. Timer ended.");
      });
    }

    // Timer Function
    function startTimer() {
      clearInterval(timerInterval); // Reset any existing timer
      totalTime = 0;
      width = 0;
      progressBar.style.width = "0%"; // Reset the progress bar

      timerInterval = setInterval(() => {
        totalTime += 0.1; // Increment accumulated time
        width = (totalTime / sectionDuration) * 100;
        progressBar.style.width = `${width}%`;

        if (width >= 100) {
          if (selectedGroupID) {
            clearInterval(timerInterval);
            displayFilteredData(selectedGroupID);
          } else {
            clearInterval(timerInterval);
            console.error("No category selected!");
          }
        }
      }, 100);
    }

    function startEndTimer() {
      clearInterval(timerInterval); // Reset any existing timer
      totalTime = 0;
      width = 0;
      progressBar.style.width = "0%"; // Reset the progress bar

      timerInterval = setInterval(() => {
        totalTime += 0.1; // Increment accumulated time
        width = (totalTime / sectionDuration) * 100;
        progressBar.style.width = `${width}%`;

        if (width >= 100) {
          clearInterval(timerInterval);
          life.classList.add('hidden');
          timebar.classList.add("hidden");
        }
      }, 100);
    }

    const event = data.find((x) => x.event_id); // Find the event by its ID
    if (event) {
      console.log(event);
      const imgEventSrc = "/img/" + event.event_image; // Construct the image path

      // Update the "event-now" image
      const eventNowImg = document.querySelector("#event-now img");
      if (eventNowImg) {
        eventNowImg.src = imgEventSrc;
      }
    } else {
      console.error("Event not found! " + event);
      console.error("Event not found! " + data);
    }

    // Initialize and Start the Process
    life.classList.remove('hidden');
    displayCategories();

  } else if (status == "sick") {
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
    let Duration = 6.9 * 2; // Duration for each section in seconds

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

    const event = data.find((x) => x.event_id); // Find the event by its ID
    if (event) {
      const imgEventSrc = "/img/" + event.event_image; // Construct the image path

      // Update the "event-now" image
      const eventNowImg = document.querySelector("#event-now-sick img");
      if (eventNowImg) {
        eventNowImg.src = imgEventSrc; // Set the new image source
      }
    } else {
      console.error("Event not found!");
    }

    startTimer();
    return "None";
  } else if (status == "kidnapped") {
    const sickness = document.getElementById("kidnapped");
    const progressBar = document.getElementById("timebar-progress-kidnapped");
    const sickCard = document.getElementById("kidnapped-card");
    const event_before = document.getElementById("event-before-kidnapped");
    const event_after = document.getElementById("event-now-kidnapped");
    const timebar = document.getElementById("timebar-kidnapped");

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

    const event = data.find((x) => x.event_id); // Find the event by its ID
    if (event) {
      const imgEventSrc = "/img/" + event.event_image; // Construct the image path

      // Update the "event-now" image
      const eventNowImg = document.querySelector("#event-now-kidnapped img");
      if (eventNowImg) {
        eventNowImg.src = imgEventSrc; // Set the new image source
      }
    } else {
      console.error("Event not found!");
    }

    startTimer();
    return "None";
  }
  else {
    const deadness = document.getElementById("dead");
    const deadCard = document.getElementById("dead-card");
    deadness.classList.remove("hidden");
    deadCard.classList.remove("hidden");
    deadCard.classList.add("flex");
  }
}
