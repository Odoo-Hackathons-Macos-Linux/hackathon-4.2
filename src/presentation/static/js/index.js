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

