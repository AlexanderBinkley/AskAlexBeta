
function sendMessage() {
    const input = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');
    const message = input.value.trim();
    if (message === '') return;

    const userMsg = document.createElement('div');
    userMsg.textContent = "You: " + message;
    chatLog.appendChild(userMsg);

    const response = document.createElement('div');
    if (message.length === 17 && /^[A-HJ-NPR-Z0-9]+$/.test(message)) {
        const fordLink = `https://parts.ford.com/shop/en/us/search?vin=${message}`;
        const repairLink = `https://repairlinkshop.com/` + 
                           `Catalog/VinDecode/${message}`;
        response.innerHTML = `AskAlex: I found links for this VIN:<br>` +
                             `<a href="${fordLink}" target="_blank">FordParts</a><br>` +
                             `<a href="${repairLink}" target="_blank">RepairLink</a>`;
    } else if (/^[0-9A-Za-z\-]+$/.test(message)) {
        const fordLink = `https://parts.ford.com/shop/en/us/search?keyword=${message}`;
        const repairLink = `https://repairlinkshop.com/Search/UniversalSearch?SearchTerm=${message}`;
        response.innerHTML = `AskAlex: Searching for part number...<br>` +
                             `<a href="${fordLink}" target="_blank">FordParts</a><br>` +
                             `<a href="${repairLink}" target="_blank">RepairLink</a>`;
    } else {
        response.textContent = "AskAlex: Sorry, I only support VINs and part numbers for now.";
    }

    chatLog.appendChild(response);
    input.value = '';
    chatLog.scrollTop = chatLog.scrollHeight;
}
