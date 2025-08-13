import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cosmosClient, dbId } from "../services/database-service";
import * as bcrypt from "bcryptjs";

const usersContainerId = process.env.COSMOS_DB_USERS_CONTAINER_ID!;

app.http("register-user", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "users/register",
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const { email, password, name } = (await request.json()) as any;

            if (!email || !password || !name) {
                context.warn("Registro fallido: datos incompletos");
                return {
                    status: 400,
                    jsonBody: { error: "Email, password, and name are required." }
                };
            }

            // Verificar si el usuario ya existe
            const { resources: existingUsers } = await cosmosClient
                .database(dbId)
                .container(usersContainerId)
                .items.query({
                    query: "SELECT * FROM c WHERE c.email = @email",
                    parameters: [{ name: "@email", value: email }]
                })
                .fetchAll();

            if (existingUsers.length > 0) {
                context.warn(`Intento de registro con email existente: ${email}`);
                return {
                    status: 409,
                    jsonBody: { error: "User with this email already exists." }
                };
            }

            // Hash de la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = {
                id: email, // Email como ID único
                email,
                name,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                purchaseHistory: []
            };

            await cosmosClient
                .database(dbId)
                .container(usersContainerId)
                .items.create(newUser);

            // No devolver hash de contraseña
            const { password: _, ...userResponse } = newUser;

            context.log(`Usuario registrado correctamente: ${email}`);
            return { status: 201, jsonBody: userResponse };

        } catch (error: any) {
            context.error("Error during user registration:", error?.message || error);
            return {
                status: 500,
                jsonBody: { error: "An internal server error occurred." }
            };
        }
    }
});
