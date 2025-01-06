import express from 'express';
import indexGroups from './index.private.routes.group';
import indexMessages from './index.private.routes.messages';

const router = express.Router();

// https::host/chat/v1/

router.use('/group', indexGroups);
router.use('/messages', indexMessages);

export default router;
