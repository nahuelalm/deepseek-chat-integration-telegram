const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Crear la app de Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la API (Backend)
app.get('/api/chatbot', (req, res) => {
    res.json({ message: "Hello from the API" });
});

// Conexión de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');
    socket.on('message', (msg) => {
        console.log('Mensaje recibido:', msg);
        socket.emit('message', 'Respuesta desde el servidor');
    });
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Servir la página de inicio (index.html) en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
