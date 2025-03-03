import { body, query } from 'express-validator';
import middleware from '../../../../utils/middleware.utils';

export const authTokenValidations = [
  body('authCode')
    .isString()
    .withMessage('authCode is required')
    .notEmpty(),
  body('redirectURI')
    .isString()
    .withMessage('redirectURI is required')
    .notEmpty(),

  middleware.validate
];

export const userConfigValidations = [
  body('identifier')
    .isNumeric()
    .withMessage('identifier is required')
    .notEmpty(),
  body('username').isString().withMessage('username is required').notEmpty(),
  body('title').isString().withMessage('title is required').notEmpty(),
  body('firstName').isString().withMessage('firstName is required').notEmpty(),
  body('lastName').isString().withMessage('lastName is required').notEmpty(),

  middleware.validate
];

export const userScannerValidations = [
  body('connexikId')
    .isString()
    .withMessage('connexikId is required')
    .notEmpty(),
  body('text').isString().withMessage('text is required').notEmpty(),

  middleware.validate
];

export const connectionsAcceptValidations = [
  body('pendingInvitations')
    .isArray()
    .withMessage('pendingInvitations is required')
    .notEmpty(),
  body('filters').isArray().withMessage('filters is required').notEmpty(),
  body('connexikId').isUUID().withMessage('connexikId is required').notEmpty(),

  middleware.validate
];

export const connectionsGrowFilterValidations = [
  body('connexikId').isUUID().withMessage('connexikId is required').notEmpty(),
  body('connections')
    .isArray()
    .withMessage('connections is required')
    .notEmpty(),
  body('filter').isString().withMessage('filter is required').notEmpty(),

  middleware.validate
];

export const connectionsGrowCountValidations = [
  query('connexikId')
    .notEmpty()
    .withMessage('connexikId is required')
    .isUUID()
    .withMessage('connexikId must be a valid UUID'),
  middleware.validate
];
