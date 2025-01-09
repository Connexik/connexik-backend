import express from 'express';

import userController from '../../controllers/user.controller';
import { userConfigValidations } from '../validations/index.validations.routes';

const router = express.Router();

router.post('/user/config', userConfigValidations, userController.config);

export default router;
