import { Router } from 'express';
import {
  authProxy,
  healthCheck,
  notFound,
  platformProxy,
} from '../controllers/gateway.controller.js';

const router = Router();

router.get('/api/health', healthCheck);
router.use('/api/v1/platform/auth', authProxy);
router.use('/api/v1/platform', platformProxy);
router.use(notFound);

export default router;
