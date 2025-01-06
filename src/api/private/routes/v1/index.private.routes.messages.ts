import express from 'express';
import ChatController from '../../controllers/chat.private.controller';

const router = express.Router();

router.post('/send', ChatController.sendMessage);
router.get('/status', ChatController.getMessageStatus);
router.post('/status-update', ChatController.updateMessageStatus);

export default router;
