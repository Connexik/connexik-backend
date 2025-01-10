import { type Request, type Response } from 'express';
import moment from 'moment';

import userService from '../../../services/user.service';

import responseUtils from '@utils/response.utils';
import { BasicLinkedInUser, GetLinkedInUser } from '@/resources/user.resource';

const config = async (req: Request, res: Response): Promise<void> => {
  const { identifier, username, title, firstName, lastName, } = req.body;

  const userData: GetLinkedInUser = await userService.processConfig(identifier, username, title, firstName, lastName);

  responseUtils.success(res, userData);
};

const scanner = async (req: Request, res: Response): Promise<void> => {
  const { convexikId, text } = req.body;

  const userData: BasicLinkedInUser = await userService.getUserData(convexikId);
  if(!userData){
    throw Error('ConvexikId not registered!');
  }
  if(userData.lastScannedAt && moment(userData.lastScannedAt).add(1, 'days').isAfter(moment())){
    throw Error('You can scan the profile only once in 24 hours.');
  }

  await userService.processScanner(userData.id, text);

  responseUtils.success(res, null);
};

export default {
  config,
  scanner
};
