const socket = io();
let messagesData = [];
let currentChatId = localStorage.getItem('chatId');
let lastMessageTimestamps = {}; // Objeto para almacenar el timestamp del último mensaje por chat

const notificationSound = new Audio('/assets/stop-13692.mp3');

// Función para reproducir el sonido de notificación
function playNotificationSound() {
  notificationSound.play().catch(error => {
    console.error('Error al reproducir el sonido de notificación:', error);
  });
}

// Solicitar chatId al cargar la página
socket.emit('checkChatId', currentChatId);

// Manejar carga inicial de mensajes
socket.on('loadChat', ({ chatId, messages }) => {
  localStorage.setItem('chatId', chatId);
  currentChatId = chatId; // Actualizar currentChatId aquí también
  messagesData = messages;
  loadChat(messages);
  updateLastMessageTimestamps(messages);
});

// Manejar creación de nuevo chat
socket.on('newChat', (message) => {
  localStorage.setItem('chatId', message.chatId);
  currentChatId = message.chatId; // Actualizar currentChatId aquí también
  messagesData = [message];
  loadChat(messagesData);
  updateLastMessageTimestamps(messagesData);
});

// Manejar nuevos mensajes enviados por el usuario
socket.on('newMessage', (message) => {
  if (message.chatId === currentChatId) {
    messagesData.push(message);
    loadChat(messagesData);
    updateLastMessageTimestamps(messagesData);
  }
});

// Manejar actualizaciones periódicas de mensajes
socket.on('updateMessages', (messages) => {
  const newMessages = messages.filter(msg => msg.chatId === currentChatId);
  
  if (newMessages.length > 0) {
    const latestMessage = newMessages[newMessages.length - 1];
    
    if (!lastMessageTimestamps[currentChatId] || latestMessage.timestamp !== lastMessageTimestamps[currentChatId]) {
      playNotificationSound();
    }
  }
  
  messagesData = newMessages;
  loadChat(messagesData);
  updateLastMessageTimestamps(messagesData);
});

function loadChat(messages) {
  const chatDiv = document.getElementById('chat');
  chatDiv.innerHTML = '';

  messages.forEach(msg => {
    const message = document.createElement('li');
    message.classList.add('message', msg.sender === 'user' ? 'right' : 'left');
    message.innerHTML = `
      <p>${msg.text}</p>
      <div class="timestamp">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
    `;
    chatDiv.appendChild(message);
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function updateLastMessageTimestamps(messages) {
  messages.forEach(msg => {
    lastMessageTimestamps[msg.chatId] = msg.timestamp;
  });
}

document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const chatId = localStorage.getItem('chatId');
  const text = document.getElementById('messageInput').value;
  if (!text) return;
  socket.emit('userMessage', { chatId, text });
  document.getElementById('messageInput').value = '';
}

function sendWelcomeMessage() {
  const chatId = localStorage.getItem('chatId');
  const welcomeMessage = "¡Hola! Me gustaría saber más detalles sobre el siguiente producto:";
  socket.emit('userMessage', { chatId, text: welcomeMessage });
}

setTimeout(() => {
  document.getElementById('chatContainer').classList.remove('hidden');
  playNotificationSound();

  // Verificar si ya se envió el mensaje de bienvenida
  const welcomeMessageSent = localStorage.getItem('welcomeMessage');
  
  if (!welcomeMessageSent) {
    sendWelcomeMessage();
    localStorage.setItem('welcomeMessage', 'true'); // Marcar como enviado
  }
}, 5000);

// setTimeout(() => {
//   document.getElementById('chatContainer').classList.remove('hidden');
//   playNotificationSound();
// }, 5000);
// Mostrar y ocultar el chat
document.getElementById('chatButton').addEventListener('click', () => {
  document.getElementById('chatContainer').classList.toggle('hidden');
});

document.getElementById('closeChat').addEventListener('click', () => {
  document.getElementById('chatContainer').classList.add('hidden');
});
