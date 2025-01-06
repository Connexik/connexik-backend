import express from 'express';
import indexPrivateV1 from './private/routes/v1/index.private.routes';
import indexPubicV2 from './public/routes/v1/index.public.routes';

const router = express.Router();

// https::host/chat

router.use('/private/v1', indexPrivateV1);
router.use('/public/v1', indexPubicV2);

export default router;
