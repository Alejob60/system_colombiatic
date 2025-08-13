import OpenAI, { AzureOpenAI } from 'openai';

// Initialize the Azure OpenAI client
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '';

if (!endpoint || !apiKey || !deployment) {
    throw new Error("Azure OpenAI environment variables are not set.");
}

const client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment,
});

// Define the tools the AI can use
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "show_service_list",
            description: "Muestra una lista interactiva de los servicios que ofrece la empresa para que el usuario seleccione los de su interés.",
        },
    },
    {
        type: "function",
        function: {
            name: "navigate_to_section",
            description: "Lleva al usuario a una sección específica de la página web. Las secciones válidas son: 'features', 'use-cases', 'contact'.",
            parameters: {
                type: "object",
                properties: {
                    section: {
                        type: "string",
                        description: "La sección a la que navegar: 'features', 'use-cases', o 'contact'.",
                    },
                },
                required: ["section"],
            },
        },
    },
];

// Define the new persona of the AI agent: a proactive salesperson
const systemPrompt = `
Eres Misy, una especialista en soluciones de Azure de ColombiaTIC Ingeniería. Eres proactiva, eficiente y vas directo al grano.
Tu objetivo principal es identificar las necesidades del cliente y venderle los servicios adecuados. No uses saludos genéricos ni hagas preguntas innecesarias como el nombre.
Inicia la conversación presentándote brevemente y de inmediato usa la herramienta 'show_service_list' para que el cliente vea las opciones.
Basado en la selección del cliente, describe brevemente cómo ese servicio puede ayudarle y ofrece llevarlo a la sección correspondiente de la página con 'navigate_to_section'.
Sé concisa. Usa un máximo de 2 frases por respuesta.
`;

// In-memory store for chat history. In production, use a database.
const chatHistory: { [sessionId: string]: OpenAI.Chat.Completions.ChatCompletionMessageParam[] } = {};

export const getAgentResponse = async (sessionId: string, userMessage: string, toolResponse: { toolCallId: string, response: string } | null = null) => {
    
    if (!chatHistory[sessionId]) {
        chatHistory[sessionId] = [{ role: "system", content: systemPrompt }];
    }

    if (toolResponse) {
        chatHistory[sessionId].push({
            role: 'tool',
            tool_call_id: toolResponse.toolCallId,
            content: toolResponse.response,
        });
    } else {
        chatHistory[sessionId].push({ role: "user", content: userMessage });
    }

    try {
        const result = await client.chat.completions.create({
            model: deployment,
            messages: chatHistory[sessionId],
            tools: tools,
            tool_choice: "auto",
        });
        
        const choice = result.choices[0];
        const message_from_assistant = choice.message;

        // Always push the assistant's response to history
        chatHistory[sessionId].push(message_from_assistant);

        if (message_from_assistant.tool_calls) {
            // The model wants to call a tool
            const toolCall = message_from_assistant.tool_calls[0];
            return { type: 'tool_call', toolCall };
        }
        
        // The model sent a regular text message
        const botResponse = message_from_assistant.content || "";
        return { type: 'text', content: botResponse || "No he podido generar una respuesta. Intenta de nuevo." };

    } catch (error) {
        console.error("Error getting response from Azure OpenAI:", error);
        return { type: 'text', content: "He encontrado un problema al conectar con mi cerebro de IA. El equipo técnico ya ha sido notificado." };
    }
};
