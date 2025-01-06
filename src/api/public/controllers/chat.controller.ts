import { type Request, type Response } from 'express';
import { type SendMessageRequest, type UpdateMessageRequest } from '@database/interface'
import responseUtils from '@utils/response.utils';
import chatServices from '@services/chat.service'

const getAllMessage = async (req: Request, res: Response): Promise<void> => {
  const groupId = Number(req.query.group_id);
  const result = await chatServices.getAllMessage(groupId)
  responseUtils.success(res, result);
};

const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const senderId = Number(req.query.sender_id)
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { message_id, content, content_type, content_url, group_id } = req.body as SendMessageRequest;

  if (!senderId || !content) {
    throw new Error('Missing required fields: senderId and content are required');
  }

  const response = await chatServices.sendMessages({
    message_id,
    sender_id: senderId,
    content,
    content_type,
    content_url,
    group_id: Number(group_id)
  });

  responseUtils.success(res, response);
};

const updateMessageStatus = async (req: Request, res: Response): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const user_id = Number(req.query.user_id)
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { message_id, delivered_at, seen_at } = req.body as UpdateMessageRequest;

  const response = await chatServices.setMessageUpdateStatus({
    user_id,
    message_id,
    delivered_at,
    seen_at
  })
  responseUtils.success(res, response);
};

export default {
  sendMessage,
  updateMessageStatus,
  getAllMessage
};
