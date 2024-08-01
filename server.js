const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path'); // Asegúrate de requerir 'path'
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Conectar a MongoDB
mongoose.connect('mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/capilla-dign765', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const messageSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  chatId: String,
  text: String,
  sender: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Manejar conexión de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('checkChatId', async (chatId) => {
    if (chatId) {
      const messages = await Message.find({ chatId }).sort({ timestamp: 1 }).exec();
      socket.emit('loadChat', { chatId, messages });
    } else {
      const newChatId = uuidv4();
      const welcomeMessage = {
        chatId: newChatId,
        text: '¡Bienvenido al nuevo chat!',
        sender: 'bot',
        timestamp: new Date()
      };
      const newMessage = new Message(welcomeMessage);
      await newMessage.save();
      socket.emit('newChat', welcomeMessage);
      const messages = await Message.find({ chatId: newChatId }).sort({ timestamp: 1 }).exec();
      socket.emit('loadChat', { chatId: newChatId, messages });
    }
  });

  socket.on('userMessage', async (message) => {
    const userMessage = new Message({
      chatId: message.chatId,
      text: message.text,
      sender: 'user',
      timestamp: new Date()
    });
    await userMessage.save();
    io.emit('newMessage', userMessage);
  });

  setInterval(async () => {
    const messages = await Message.find().sort({ timestamp: 1 }).exec();
    io.emit('updateMessages', messages);
  }, 2000);
});

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp3')) {
      res.setHeader('Content-Type', 'audio/mpeg');
    }
  }
}));

// Configurar la carpeta de archivos estáticos para servir los archivos de la aplicación
app.use(express.static(path.join(__dirname, 'public')));

// Configurar la ruta de captura (catch-all) para servir index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3388;

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${port}`);
});
