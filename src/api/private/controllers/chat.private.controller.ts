import { type Request, type Response } from 'express';

import responseUtils from '@utils/response.utils';

const sendMessage = async (req: Request, res: Response): Promise<void> => {
  responseUtils.success(res, null);
};

const getMessageStatus = async (req: Request, res: Response): Promise<void> => {
  responseUtils.success(res, null);
};

const updateMessageStatus = async (req: Request, res: Response): Promise<void> => {
  responseUtils.success(res, null);
};

export default {
  sendMessage,
  getMessageStatus,
  updateMessageStatus
};
