
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
    const partTerm = message;
    const apiURL = `https://askalex-scraper.alexander32244.repl.co/lookup?vin=${currentVIN}&part=${encodeURIComponent(partTerm)}`;

    const loading = document.createElement("div");
    loading.textContent = "AskAlex: Searching FordParts.com...";
    chatLog.appendChild(loading);
    chatLog.scrollTop = chatLog.scrollHeight;

    try {
      const res = await fetch(apiURL);
      const data = await res.json();

      const resultText = data.partNumber === "Not found"
        ? `I couldn’t find a part number, but here’s the closest match I could find for "${partTerm}":<br>
           <a href="${data.url}" target="_blank">View on FordParts.com</a>`
        : `Here's what I found for "${partTerm}" on your ${decodedVehicle}:<br>
           Part Number: ${data.partNumber}<br>
           List Price: ${data.price}<br>
           <a href="${data.url}" target="_blank">View on FordParts.com</a>`;

      const result = document.createElement("div");
      result.innerHTML = "AskAlex: " + resultText;
      chatLog.appendChild(result);
    } catch (e) {
      const errorMsg = document.createElement("div");
      errorMsg.textContent = "AskAlex: There was an error contacting the parts lookup system.";
      chatLog.appendChild(errorMsg);
    }

    stage = "done";
  } else {
    response.textContent = "AskAlex: Restart the page to enter a new VIN.";
    chatLog.appendChild(response);
  }

  input.value = "";
  chatLog.scrollTop = chatLog.scrollHeight;
}
