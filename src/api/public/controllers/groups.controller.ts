import { type Request, type Response } from 'express';

import responseUtils from '@utils/response.utils';
import groupService from '../../../services/group.service';

const getAllGroups = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.query.user_id);
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

  const data = await groupService.getGroups(userId, page, limit)
  responseUtils.success(res, data);
};

const createGroup = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.query.user_id);
  const {
    other_user: otherUser
  }: { other_user: number } = req.body;

  const data = await groupService.createGroup(userId, otherUser)
  responseUtils.success(res, data);
};

const getStatus = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.query.user_id);
  const groupId = Number(req.query.group_id);
  const data = await groupService.getGroupStatus(userId, groupId)
  responseUtils.success(res, data);
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.query.user_id);
  const {
    group_id: groupId
  }: { group_id: number } = req.body;
  const data = await groupService.getGroupStatus(userId, groupId)
  responseUtils.success(res, data);
  responseUtils.success(res, null);
};

const groupInfo = async (req: Request, res: Response): Promise<void> => {
  responseUtils.success(res, null);
};

export default {
  getAllGroups,
  createGroup,
  getStatus,
  updateStatus,
  groupInfo
};
