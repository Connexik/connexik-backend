import express from 'express';

import userController from '../../controllers/user.controller';
import { userConfigValidations, userScannerValidations } from '../validations/index.validations.routes';

const router = express.Router();

router.post('/user/config', userConfigValidations, userController.config);
router.post('/user/scanner', userScannerValidations, userController.scanner);

export default router;
