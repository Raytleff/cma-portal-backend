import express, { Application } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import { Server, Socket } from 'socket.io';
import prisma from './config/prisma';

import { errorHandler } from './middleware/errorMiddleware';
import { corsOptions } from './config/corsOptions';


import usersRoutes from './routes/usersRoutes';
import googleRoutes from './routes/googleRoutes';
import imageRoutes from './routes/uploadImageRoutes';

dotenv.config();


const app: Application = express();
const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET as string,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(cors(corsOptions));



app.use('/api/users', usersRoutes);
// app.use('/api/auth', googleRoutes);
// app.use('/api/images', imageRoutes);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../frontend/build');

  app.use(express.static(clientPath));

  app.get('*', (_, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
} else {
  app.get('/', (_, res) => res.send('API running...'));
}

app.use(errorHandler);


server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  try {
    await prisma.$connect();
    console.log('🚀 Prisma connected to database');
  } catch (error) {
    console.error('❌ Prisma connection error:', error);
    process.exit(1);
  }
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('🔌 Prisma disconnected');
});