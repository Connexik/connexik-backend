import { type Request, type Response } from 'express';

import responseUtils from '@utils/response.utils';
import groupService from '@services/group.service';

const createGroup = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.query.user_id);
  const {
    other_user: otherUser
  }: { other_user: number } = req.body;

  const data = await groupService.createGroup(userId, otherUser)
  responseUtils.success(res, data);
};

const blockGroup = async (req: Request, res: Response): Promise<void> => {
  responseUtils.success(res, null);
};

export default {
  createGroup,
  blockGroup
};
