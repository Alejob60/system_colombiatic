import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cosmosClient, dbId } from "../services/database-service";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const usersContainerId = process.env.COSMOS_DB_USERS_CONTAINER_ID!;
const jwtSecret = process.env.JWT_SECRET!;

app.http("login-user", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "users/login",
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const { email, password } = (await request.json()) as any;

            if (!email || !password) {
                context.warn("Intento de login con datos incompletos");
                return { status: 400, jsonBody: { error: "Email and password are required." } };
            }

            // Buscar usuario
            const { resources: users } = await cosmosClient
                .database(dbId)
                .container(usersContainerId)
                .items.query({
                    query: "SELECT * from c WHERE c.email = @email",
                    parameters: [{ name: "@email", value: email }]
                })
                .fetchAll();

            if (users.length === 0) {
                context.warn(`Intento de login con email inexistente: ${email}`);
                return { status: 401, jsonBody: { error: "Invalid credentials." } };
            }

            const user = users[0];

            // Verificar contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                context.warn(`Contraseña incorrecta para email: ${email}`);
                return { status: 401, jsonBody: { error: "Invalid credentials." } };
            }

            // Crear JWT
            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            };

            const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

            context.log(`Usuario autenticado correctamente: ${email}`);
            return {
                status: 200,
                jsonBody: {
                    token,
                    user: payload.user
                }
            };

        } catch (error: any) {
            context.error("Error during user login:", error?.message || error);
            return { status: 500, jsonBody: { error: "An internal server error occurred." } };
        }
    }
});
