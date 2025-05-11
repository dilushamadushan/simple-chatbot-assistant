const sendChatBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatbot = document.getElementById('chatBox');

const API_KEY = "Add your API key here"; // Replace with your actual API key
const API_URL = `https://api.example.com/chat?apiKey=${API_KEY}`; // Replace with your actual API URL

const botResponse = async (userInput) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: userInput }]
            }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error.message);

        const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'No response received.';

        const lastMsg = chatbot.lastChild;
        if (lastMsg && lastMsg.textContent === 'Thinking...') {
            chatbot.removeChild(lastMsg);
        }

        chatbot.appendChild(createChatMessage(apiResponseText, 'incoming-msg'));
        chatbot.scrollTop = chatbot.scrollHeight;

    } catch (error) {
        console.error('Error:', error);

        const lastMsg = chatbot.lastChild;
        if (lastMsg && lastMsg.textContent === 'Thinking...') {
            chatbot.removeChild(lastMsg);
        }

        chatbot.appendChild(createChatMessage('⚠️ Error: ' + error.message, 'incoming-msg'));
        chatbot.scrollTop = chatbot.scrollHeight;
    }
};

const createChatMessage = (message, className) => {
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('d-flex', 'mb-2');

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', className);

    if (className === 'outgoing-msg') {
        wrapperDiv.classList.add('justify-content-end');
        msgDiv.innerHTML = `<p class="mb-0">${message}</p>`;
        wrapperDiv.appendChild(msgDiv);
    } else {
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-headset me-2 mt-1 text-primary';
        wrapperDiv.appendChild(icon);

        msgDiv.innerHTML = `<p class="mb-0">${message}</p>`;
        wrapperDiv.appendChild(msgDiv);
    }

    return wrapperDiv;
};

const handleChatInput = () => {
    const userInput = chatInput.value.trim();
    if (!userInput) return;

    chatbot.appendChild(createChatMessage(userInput, 'outgoing-msg'));
    chatInput.value = '';

    setTimeout(() => {
        chatbot.appendChild(createChatMessage('Thinking...', 'incoming-msg'));
        chatbot.scrollTop = chatbot.scrollHeight;
        botResponse(userInput);
    }, 600);
};

sendChatBtn.addEventListener('click', handleChatInput);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatInput();
});
