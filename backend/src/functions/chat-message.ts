import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getAgentResponse } from "../services/agent-service";

export async function chatMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const body = await request.json() as { 
            message: string; 
            sessionId: string;
            toolResponse?: { toolCallId: string, response: string };
        };
        
        const userMessage = body.message;
        const sessionId = body.sessionId;
        const toolResponse = body.toolResponse;

        if (!userMessage || !sessionId) {
            return {
                status: 400,
                jsonBody: { error: "El mensaje y el sessionId son requeridos." }
            };
        }

        context.log(`Invoking agent for session: ${sessionId}`);
        const agentResponse = await getAgentResponse(sessionId, userMessage, toolResponse || null);

        return { 
            status: 200,
            jsonBody: agentResponse
        };

    } catch (error) {
        context.error("Error processing chat message:", error);
        return {
            status: 500,
            jsonBody: { error: "Ocurrió un error al procesar tu mensaje." }
        }
    }
};

app.http('chat-message', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: chatMessage
});
