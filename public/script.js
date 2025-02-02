const socket = io();

// Seleccionar elementos del DOM
const messageInput = document.getElementById('message-input');
const chatForm = document.getElementById('chat-form');
const messagesContainer = document.getElementById('messages');

// Función para agregar un mensaje al chat
function addMessage(content, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender);
    messageElement.textContent = content;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Desplazar hacia abajo
}

// Enviar mensaje al servidor cuando se envía el formulario
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const message = messageInput.value.trim();
    if (message !== '') {
        addMessage(message, 'user'); // Agregar el mensaje del usuario
        socket.emit('message', message); // Enviar mensaje al servidor
        messageInput.value = ''; // Limpiar el campo de entrada
    }
});

// Escuchar la respuesta del servidor
socket.on('message', (message) => {
    addMessage(message, 'bot'); // Agregar la respuesta del bot
});
