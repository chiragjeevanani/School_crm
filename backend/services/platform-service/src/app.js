import express from 'express';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './config/errorHandler.js';
import platformRoutes from './routes/platformRoutes.js';

const app = express();

app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '5mb' }));

app.use(platformRoutes);
app.use(errorHandler);

export default app;
