import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import gatewayRoutes from './routes/gatewayRoutes.js';

const app = express();

app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(cors({ origin: env.corsOrigin, credentials: true }));

app.use(gatewayRoutes);

export default app;
