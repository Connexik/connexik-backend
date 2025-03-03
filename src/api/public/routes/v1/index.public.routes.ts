import express from 'express';

import userController from '../../controllers/user.controller';
import {
  authTokenValidations,
  connectionsAcceptValidations,
  connectionsGrowCountValidations,
  connectionsGrowFilterValidations,
  userConfigValidations,
  userScannerValidations
} from '../validations/index.validations.routes';
import connectionsController from '../../controllers/connections.controller';
import authController from '../../controllers/auth.controller';
import middlewareUtils from '@/utils/middleware.utils';
import { asyncHandler } from '@utils/async-handler.utils';

const router = express.Router();

// Public routes
router.post('/auth/token', authTokenValidations, asyncHandler(authController.token));

// Protected routes after this point
router.use(middlewareUtils.authMiddleware);

router.post('/auth/status', asyncHandler(authController.status));
router.post('/user/config', userConfigValidations, asyncHandler(userController.config));
router.post('/user/scanner', userScannerValidations, asyncHandler(userController.scanner));

router.post(
  '/connections/accept/filter',
  connectionsAcceptValidations,
  asyncHandler(connectionsController.acceptFilter)
);

router.post(
  '/connections/grow/filter',
  connectionsGrowFilterValidations,
  asyncHandler(connectionsController.growFilter)
);

router.post(
  '/connections/grow/count',
  connectionsGrowCountValidations,
  asyncHandler(connectionsController.growConnectionsCount)
);

export default router;
