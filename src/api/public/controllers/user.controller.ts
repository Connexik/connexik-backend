import { type Request, type Response } from 'express';
import moment from 'moment';

import userService from '../../../services/user.service';

import responseUtils from '@utils/response.utils';
import {
  type BasicLinkedInUser,
  type GetLinkedInUser
} from '@/resources/user.resource';

const config = async (req: Request, res: Response): Promise<void> => {
  const { identifier, username, title, firstName, lastName } = req.body as {
    identifier: number
    username: string
    title: string
    firstName: string
    lastName: string
  };
  const authUserId = req.authUserId;

  const userData: GetLinkedInUser = await userService.processConfig(
    authUserId,
    identifier,
    username,
    title,
    firstName,
    lastName
  );

  responseUtils.success(res, userData);
};

const scanner = async (req: Request, res: Response): Promise<void> => {
  const { connexikId, text } = req.body as { connexikId: string, text: string };

  const userData: BasicLinkedInUser = await userService.getUserInfo(connexikId);
  if (!userData) {
    throw Error('connexikId not registered!');
  }
  if (
    userData.lastScannedAt &&
    moment(userData.lastScannedAt).isAfter(moment())
  ) {
    throw Error('You can scan the profile only once in 24 hours.');
  }

  await userService.processScanner(userData.id, text);

  responseUtils.success(res, null);
};

export default {
  config,
  scanner
};
