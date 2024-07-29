const socket = io();
let messagesData = [];
let currentChatId = localStorage.getItem('chatId');

// Solicitar chatId al cargar la página
socket.emit('checkChatId', currentChatId);

// Manejar carga inicial de mensajes
socket.on('loadChat', ({ chatId, messages }) => {
  localStorage.setItem('chatId', chatId);
  currentChatId = chatId; // Actualizar currentChatId aquí también
  messagesData = messages;
  loadChat(messages);
});

// Manejar creación de nuevo chat
socket.on('newChat', (message) => {
  localStorage.setItem('chatId', message.chatId);
  currentChatId = message.chatId; // Actualizar currentChatId aquí también
  messagesData = [message];
  loadChat(messagesData);
});

// Manejar nuevos mensajes enviados por el usuario
socket.on('newMessage', (message) => {
  if (message.chatId === currentChatId) {
    messagesData.push(message);
    loadChat(messagesData);
  }
});

// Manejar actualizaciones periódicas de mensajes
socket.on('updateMessages', (messages) => {
  messagesData = messages.filter(msg => msg.chatId === currentChatId);
  loadChat(messagesData);
});

function loadChat(messages) {
  const chatDiv = document.getElementById('chat');
  chatDiv.innerHTML = '';

  messages.forEach(msg => {
    const message = document.createElement('li');
    message.classList.add('message', msg.sender === 'user' ? 'right' : 'left');
    message.innerHTML = `
      <img class="logochat" src="https://randomuser.me/api/portraits/${msg.sender === 'user' ? 'men/67.jpg' : 'women/17.jpg'}" alt="">
      <p>${msg.text}</p>
      <div class="timestamp">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    chatDiv.appendChild(message);
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;
}

document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const chatId = localStorage.getItem('chatId');
  const text = document.getElementById('messageInput').value;
  socket.emit('userMessage', { chatId, text });
  document.getElementById('messageInput').value = '';
}

// Mostrar y ocultar el chat
document.getElementById('chatButton').addEventListener('click', () => {
  document.getElementById('chatContainer').classList.toggle('hidden');
});

document.getElementById('closeChat').addEventListener('click', () => {
  document.getElementById('chatContainer').classList.add('hidden');
});