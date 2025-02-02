// server/deepseek.js

const axios = require('axios');

async function generateResponse(prompt) {
    const url = "http://localhost:11434/api/generate";
    
    // Crear el prompt que fuerza la respuesta en español
    const promptConEstilo = `Responde siempre en español y en un estilo amigable. Si el usuario pregunta algo sobre un tema específico, asegúrate de proporcionar detalles técnicos. ${prompt}`;

    const data = {
        model: "codellama",  // O el modelo que estés utilizando
        prompt: promptConEstilo
    };

    try {
        const response = await axios.post(url, data, { responseType: 'stream' });

        let fullResponse = "";
        response.data.on('data', (chunk) => {
            try {
                const jsonLine = JSON.parse(chunk.toString());
                fullResponse += jsonLine.response || "";
            } catch (error) {
                console.error("Error parsing:", error);
            }
        });

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
            
            resolve(fullResponse);
            });
        });
    } catch (error) {
        console.error("Error al generar la respuesta:", error);
        throw new Error('Error al generar la respuesta');
    }
}


module.exports = { generateResponse };
