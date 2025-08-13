import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAgentResponse } from "../services/agent-service";

// --- Este es un manejador de ejemplo para un webhook de email (usando SendGrid Inbound Parse como ejemplo) ---
// Para que funcione, necesitas:
// 1. Una cuenta de SendGrid (u otro servicio como Mailgun).
// 2. Configurar el "Inbound Parse" de SendGrid para que apunte a la URL de esta función.
//    Esto convierte los emails entrantes a una dirección específica en peticiones HTTP POST.

export async function emailWebhook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Email webhook processed request for url "${request.url}"`);

    try {
        // Los datos del email usualmente vienen como 'multipart/form-data'.
        // La librería de la función de Azure puede parsearlo si el content-type es correcto.
        const parsedData = await request.formData();
        
        const userMessage = parsedData.get('text') as string; // El cuerpo del email
        const fromEmail = parsedData.get('from') as string; // e.g., "John Doe <john.doe@example.com>"
        
        if (!userMessage || !fromEmail) {
            return { status: 400, jsonBody: { error: "Request body is missing 'text' or 'from' fields." } };
        }

        // Extraer solo la dirección de correo para usarla como sessionId
        const emailRegex = /<(.+)>/;
        const match = fromEmail.match(emailRegex);
        const sessionId = match ? match[1] : fromEmail;

        context.log(`Invoking agent for email user: ${sessionId}`);
        const botResponse = await getAgentResponse(sessionId, userMessage);

        // Una vez que tienes la respuesta, podrías:
        // 1. Almacenarla en una base de datos.
        // 2. Crear un ticket en un sistema de soporte.
        // 3. Enviar una respuesta automática por email usando Nodemailer (como en contact-form-handler).
        
        context.log(`Generated response for ${sessionId}: ${botResponse}`);
        // Por ahora, solo registramos la respuesta y devolvemos un 200 OK para que el servicio de webhook sepa que lo recibimos.
        
        return { 
            status: 200,
            body: "Email processed successfully."
        };

    } catch (error) {
        context.error("Error processing email webhook:", error);
        return { status: 500, body: "An internal error occurred." };
    }
};

app.http('email-webhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: emailWebhook
});
