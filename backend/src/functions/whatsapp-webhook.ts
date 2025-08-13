import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAgentResponse } from "../services/agent-service";

// --- Este es un manejador de ejemplo para la API de WhatsApp (usando Twilio como ejemplo) ---
// Para que funcione, necesitas:
// 1. Una cuenta de Twilio con un número de WhatsApp habilitado.
// 2. Configurar el webhook de "A message comes in" en Twilio para que apunte a la URL de esta función.
// 3. Añadir TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN a tus variables de entorno.

export async function whatsappWebhook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`WhatsApp webhook processed request for url "${request.url}"`);

    try {
        // Twilio envía los datos como application/x-www-form-urlencoded
        const body = new URLSearchParams(await request.text());
        const userMessage = body.get('Body');
        const fromNumber = body.get('From'); // e.g., 'whatsapp:+14155238886'

        if (!userMessage || !fromNumber) {
            return { status: 400, body: "Request body is missing 'Body' or 'From' fields." };
        }

        // Usamos el número de teléfono como 'sessionId' para mantener el historial de la conversación.
        const sessionId = fromNumber;
        
        context.log(`Invoking agent for WhatsApp user: ${sessionId}`);
        const botResponse = await getAgentResponse(sessionId, userMessage);

        // Aquí, construirías la respuesta que Twilio espera.
        // TwiML (Twilio Markup Language) es una forma de hacerlo.
        const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${botResponse}</Message>
</Response>`;

        return { 
            status: 200,
            headers: { 'Content-Type': 'text/xml' },
            body: twimlResponse
        };

    } catch (error) {
        context.error("Error processing WhatsApp webhook:", error);
        return { status: 500, body: "An internal error occurred." };
    }
};

app.http('whatsapp-webhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: whatsappWebhook
});
