import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { Server } from 'socket.io';
import prisma from './config/prisma.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { corsOptions } from './config/corsOptions.js';
import usersRoutes from './routes/usersRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
app.use(cors(corsOptions));
// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CMA Portal API Documentation',
    customfavIcon: '/favicon.ico'
}));
// API Routes
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
// app.use('/api/auth', googleRoutes);
// app.use('/api/images', imageRoutes);
if (process.env.NODE_ENV === 'production') {
    const clientPath = path.join(__dirname, '../frontend/build');
    app.use(express.static(clientPath));
    app.get('*', (_, res) => {
        res.sendFile(path.join(clientPath, 'index.html'));
    });
}
else {
    app.get('/', (_, res) => {
        res.send(`
      <h1>CMA Portal API</h1>
      <p>API is running...</p>
      <a href="/api-docs">📚 View API Documentation</a>
    `);
    });
}
app.use(errorHandler);
server.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
    try {
        await prisma.$connect();
        console.log('🚀 Prisma connected to database');
    }
    catch (error) {
        console.error('❌ Prisma connection error:', error);
        process.exit(1);
    }
});
process.on('beforeExit', async () => {
    await prisma.$disconnect();
    console.log('🔌 Prisma disconnected');
});
