
let stage = "vin";
let currentVIN = "";
let decodedVehicle = "unknown vehicle";

function handleInput() {
  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");
  const message = input.value.trim();

  if (message === "") return;

  const userMsg = document.createElement("div");
  userMsg.textContent = "You: " + message;
  chatLog.appendChild(userMsg);

  const response = document.createElement("div");

  if (stage === "vin") {
    if (message.length === 17 && /^[A-HJ-NPR-Z0-9]+$/.test(message)) {
      currentVIN = message;
      decodedVehicle = "2022 Ford F-150";  // Fake decode for now
      response.textContent = `AskAlex: Got it! I found a ${decodedVehicle}. What part are we looking for?`;
      stage = "part";
    } else {
      response.textContent = "AskAlex: Please enter a valid 17-character VIN.";
    }
  } else if (stage === "part") {
    const searchTerm = encodeURIComponent(message);
    const fordURL = `https://parts.ford.com/shop/en/us/search?vin=${currentVIN}&keyword=${searchTerm}`;
    response.innerHTML = `AskAlex: Here's what I found for "${message}" on your ${decodedVehicle}:<br>
      Part Number: FAKE-1234<br>
      List Price: $19.99<br>
      <a href="${fordURL}" target="_blank">View on FordParts.com</a>`;
    stage = "done";
  } else {
    response.textContent = "AskAlex: Restart the page to enter a new VIN.";
  }

  chatLog.appendChild(response);
  input.value = "";
  chatLog.scrollTop = chatLog.scrollHeight;
}
