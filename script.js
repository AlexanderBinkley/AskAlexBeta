
let stage = "vin";
let currentVIN = "";
let decodedVehicle = "unknown vehicle";

async function handleInput() {
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
      response.textContent = "AskAlex: Decoding VIN...";
      chatLog.appendChild(response);
      input.value = "";
      chatLog.scrollTop = chatLog.scrollHeight;

      // Call NHTSA API
      const apiURL = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${currentVIN}?format=json`;
      const res = await fetch(apiURL);
      const data = await res.json();
      const results = data.Results;

      const year = results.find(r => r.Variable === "Model Year")?.Value || "Unknown Year";
      const make = results.find(r => r.Variable === "Make")?.Value || "Unknown Make";
      const model = results.find(r => r.Variable === "Model")?.Value || "Unknown Model";
      const trim = results.find(r => r.Variable === "Trim")?.Value || "";

      decodedVehicle = `${year} ${make} ${model}${trim ? " " + trim : ""}`;

      const response2 = document.createElement("div");
      response2.textContent = `AskAlex: Got it! I found a ${decodedVehicle}. What part are we looking for?`;
      chatLog.appendChild(response2);
      stage = "part";
    } else {
      response.textContent = "AskAlex: Please enter a valid 17-character VIN.";
      chatLog.appendChild(response);
    }
  } else if (stage === "part") {
    const searchTerm = encodeURIComponent(message);
    const fordURL = `https://parts.ford.com/shop/en/us/search?vin=${currentVIN}&keyword=${searchTerm}`;
    response.innerHTML = `AskAlex: Here's what I found for "${message}" on your ${decodedVehicle}:<br>
      Part Number: FAKE-1234<br>
      List Price: $19.99<br>
      <a href="${fordURL}" target="_blank">View on FordParts.com</a>`;
    stage = "done";
    chatLog.appendChild(response);
  } else {
    response.textContent = "AskAlex: Restart the page to enter a new VIN.";
    chatLog.appendChild(response);
  }

  input.value = "";
  chatLog.scrollTop = chatLog.scrollHeight;
}
