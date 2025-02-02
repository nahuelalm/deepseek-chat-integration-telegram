const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Función generateResponse para simular la respuesta del chatbot
const generateResponse = (message) => {
    return new Promise((resolve, reject) => {
        // Aquí puedes agregar la lógica para interactuar con la API o el procesamiento del mensaje
        setTimeout(() => {
            if (message.toLowerCase().includes('hola')) {
                resolve('¡Hola! ¿Cómo puedo ayudarte hoy?');
            } else if (message.toLowerCase().includes('adiós')) {
                resolve('¡Adiós! Que tengas un buen día.');
            } else {
                resolve('Lo siento, no entendí eso.');
            }
        }, 1000);
    });
};

// Crear la app de Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Ruta para la API de chat
app.get('/api/chatbot', (req, res) => {
    res.json({ message: "Hello from the API" });
});

// Conexión de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');
    socket.on('message', async (msg) => {
        console.log('Mensaje recibido:', msg);

        try {
            // Llamada a la función para generar la respuesta
            const apiResponse = await generateResponse(msg);
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

// Servir la página de inicio (index.html) en la raíz
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
