
function sendMessage() {
    const input = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');
    const message = input.value.trim();
    if (message === '') return;

    const userMsg = document.createElement('div');
    userMsg.textContent = "You: " + message;
    chatLog.appendChild(userMsg);

    // Fake response for now
    const response = document.createElement('div');
    if (message.length === 17) {
        response.textContent = "AskAlex: Searching for VIN in FordParts.com and RepairLink...";
    } else {
        response.textContent = "AskAlex: Let me check that part for you...";
    }
    chatLog.appendChild(response);

    input.value = '';
    chatLog.scrollTop = chatLog.scrollHeight;
}
