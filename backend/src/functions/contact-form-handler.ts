import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { EmailClient } from "@azure/communication-email";

export async function contactFormHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const data = await request.json() as any;

        if (!data.from_name || !data.from_email || !data.requirements) {
            return { status: 400, jsonBody: { message: 'Faltan campos requeridos en el formulario.' } };
        }

        // Get ACS credentials from environment variables
        const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
        const senderAddress = process.env.ACS_SENDER_ADDRESS;
        const recipientAddress = process.env.EMAIL_TO;

        if (!connectionString || !senderAddress || !recipientAddress) {
            context.error("Azure Communication Services configuration is missing.");
            return { status: 500, jsonBody: { message: 'La configuración del servicio de correo está incompleta en el servidor.' } };
        }

        const emailClient = new EmailClient(connectionString);

        const emailMessage = {
            senderAddress: senderAddress,
            content: {
                subject: `Nueva Solicitud de Cotización de: ${data.company_name}`,
                html: `
                    <h2>Nueva Solicitud de Cotización</h2>
                    <p><strong>Nombre:</strong> ${data.from_name}</p>
                    <p><strong>Email:</strong> ${data.from_email}</p>
                    <p><strong>Teléfono:</strong> ${data.from_phone}</p>
                    <p><strong>Empresa:</strong> ${data.company_name}</p>
                    <p><strong>NIT:</strong> ${data.company_nit}</p>
                    <hr>
                    <h3>Detalles de la Solicitud</h3>
                    <p><strong>Servicios de Interés:</strong></p>
                    <p>${data.selected_services || 'No especificados'}</p>
                    <p><strong>Requerimientos:</strong></p>
                    <p>${data.requirements}</p>
                    <p><strong>Número de Despliegues:</strong> ${data.deployments}</p>
                    <p><strong>Mensaje Adicional:</strong></p>
                    <p>${data.message || 'Ninguno'}</p>
                `,
            },
            recipients: {
                to: [{ address: recipientAddress }],
            },
        };

        const poller = await emailClient.beginSend(emailMessage);
        await poller.pollUntilDone();

        return { status: 200, jsonBody: { message: 'Formulario enviado con éxito.' } };

    } catch (error) {
        context.error('Error sending email via ACS:', error);
        return { status: 500, jsonBody: { message: 'Ocurrió un error al enviar el formulario.' } };
    }
}

app.http('contact-form-handler', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: contactFormHandler
});
