import { body } from 'express-validator';
import middleware from '../../../../utils/middleware.utils';

export const userConfigValidations = [
  body('lIdentifier')
    .isString().withMessage('lIdentifier is required')
    .notEmpty(),

  middleware.validate
]
