import { getMessages, sendMessage, updateStatus } from '@database/repositories/ChatRepository'
import { type GetMessage, type MessageResponse, type SendMessageRequest, type UpdateMessageRequest } from '@database/interface'

const getAllMessage = async (groupId: number): Promise<GetMessage[]> => {
  return await getMessages(groupId)
}

const sendMessages = async (requestData: SendMessageRequest): Promise<MessageResponse> => {
  return await sendMessage(requestData)
}

const setMessageUpdateStatus = async (requestData: UpdateMessageRequest): Promise<MessageResponse> => {
  return await updateStatus(requestData)
}

export default {
  getAllMessage,
  sendMessages,
  setMessageUpdateStatus
}
