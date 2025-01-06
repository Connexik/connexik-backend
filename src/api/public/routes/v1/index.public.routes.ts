import express from 'express';
import indexGroups from '../v1/index.routes.group';
import indexMessages from '../v1/index.routes.messages';
import configController from '../../controllers/config.controller';

const router = express.Router();

// https::host/chat/v1/

router.use('/group', indexGroups);
router.use('/messages', indexMessages);

router.get('/config', configController.config);

export default router;
