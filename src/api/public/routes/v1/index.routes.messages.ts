import express from 'express';
import ChatController from '@api/public/controllers/chat.controller';
import { sendMessageValidation } from '@api/public/routes/validations/index.validations.routes'

const router = express.Router();

router.get('/', ChatController.getAllMessage);
router.post('/send', sendMessageValidation, ChatController.sendMessage);
router.post('/status', ChatController.updateMessageStatus);

export default router;
