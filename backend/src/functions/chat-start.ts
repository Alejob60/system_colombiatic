import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "crypto";

export async function chatStart(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const sessionId = randomUUID();
    const welcomeMessage = "¡Hola! Soy el asistente virtual de Colombiatic Ingeniería. Para comenzar, ¿podrías indicarme tu nombre y el de tu empresa?";

    const response = {
        sessionId: sessionId,
        message: welcomeMessage
    };

    return { 
        status: 200,
        jsonBody: response 
    };
};

app.http('chat-start', {
    methods: ['POST'], // Only allow POST requests for starting a session
    authLevel: 'anonymous',
    handler: chatStart
});