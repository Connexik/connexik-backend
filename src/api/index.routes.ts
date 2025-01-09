import express from 'express';
import indexPlublicRoutes from './public/routes/v1/index.public.routes';

const router = express.Router();

router.use('/api/v1', indexPlublicRoutes);

export default router;
