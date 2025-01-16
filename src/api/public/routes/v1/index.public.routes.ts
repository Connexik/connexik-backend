import express from 'express';

import userController from '../../controllers/user.controller';
import {
  connectionsAcceptValidations,
  userConfigValidations,
  userScannerValidations
} from '../validations/index.validations.routes';
import connectionsController from '../../controllers/connections.controller';

const router = express.Router();

router.post('/user/config', userConfigValidations, userController.config);
router.post('/user/scanner', userScannerValidations, userController.scanner);

router.post(
  '/connections/accept/filter',
  connectionsAcceptValidations,
  connectionsController.acceptFilter
);

export default router;
