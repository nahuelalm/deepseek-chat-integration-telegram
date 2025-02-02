const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { generateResponse } = require('./server/deepseek');  // Importar la función de deepseek.js

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Conexión a Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    // Escuchar mensajes de chat
    socket.on('message', async (msg) => {
        console.log('Mensaje recibido:', msg);

        try {
            // Realizar la llamada a la API con el mensaje del usuario
            const apiResponse = await generateResponse(msg);  // Llamamos a la función de deepseek.js con el mensaje

            // Enviar la respuesta al cliente
            socket.emit('message', apiResponse);
        } catch (error) {
            console.error('Error al procesar el mensaje:', error);
            socket.emit('message', 'Hubo un error al procesar tu solicitud.');
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Servir una página HTML en la raíz
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(3000, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto 3000`);
});
