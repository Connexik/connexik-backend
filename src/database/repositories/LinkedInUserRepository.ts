import prisma from '../connection/data-source';
import {
  type GetMessage,
  type SendMessageRequest,
  type MessageResponse,
  type Group,
  type UpdateMessageRequest,
  type Message
} from '@database/interface'
import { getDeliveryStatus, parseCallInfo } from '@services/helper.service'

export const getMessages = async (groupId: number): Promise<GetMessage[]> => {
  const groupExists = await prisma.group.findFirst({
    where: {
      id: groupId
    }
  })

  if (!groupExists) {
    throw Error('Group doesnot exist');
  }

  const messages: Message[] = await prisma.message.findMany({
    where: {
      groupId
    },
    include: {
      deliveries: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return messages.map(message => {
    const latestDelivery = message.deliveries[0];

    return {
      message_id: message.messageId,
      group_id: Number(message.groupId),
      sender_id: message.senderId,
      content: message.content,
      content_type: message.messageType?.toUpperCase() ?? 'TEXT',
      content_url: message.mediaUrl,
      sent_at: message.createdAt.toISOString(),
      delivered_at: latestDelivery?.deliveredAt?.toISOString() ?? null,
      seen_at: latestDelivery?.seenAt?.toISOString() ?? null,
      call: parseCallInfo(message.content, message.messageType ?? '', message.messageId),
      delivery_status: getDeliveryStatus(
        latestDelivery?.deliveredAt ?? null,
        latestDelivery?.seenAt ?? null
      )
    };
  });
};

export const sendMessage = async (
  requestData: SendMessageRequest
): Promise<MessageResponse> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { message_id, sender_id, content, content_type, content_url, group_id } = requestData;

  return await prisma.$transaction(async (tx) => {
    const existingGroup = await tx.group.findFirst({
      where: {
        id: group_id,
        status: 'ACTIVE'
      }
    });

    if (!existingGroup) {
      throw new Error('Group not found or user not authorized');
    }
    const targetGroup: Group = existingGroup;

    const message = await tx.message.create({
      data: {
        messageId: message_id,
        groupId: targetGroup.id,
        senderId: sender_id,
        content,
        messageType: content_type,
        mediaUrl: content_url || null
      }
    });

    await tx.messageDelivery.create({
      data: {
        messageId: message.messageId
      }
    });

    await tx.group.update({
      where: { id: targetGroup.id },
      data: { latestMessageId: message_id }
    });

    const delivery = await tx.messageDelivery.findFirst({
      where: {
        messageId: message_id
      },
      select: {
        seenAt: true,
        deliveredAt: true
      }
    })

    return {
      message_id: message.messageId,
      group_id: Number(message.groupId),
      sender_id: message.senderId,
      content: message.content,
      content_type: message.messageType || 'TEXT',
      content_url: message.mediaUrl,
      sent_at: message.createdAt.toISOString(),
      delivered_at: delivery.deliveredAt ? delivery.deliveredAt.toISOString() : null,
      seen_at: delivery.seenAt ? delivery.seenAt.toISOString() : null,
      call: null,
      delivery_status: getDeliveryStatus(delivery.deliveredAt, delivery.deliveredAt)
    };
  });
};

export const updateStatus = async (requestData: UpdateMessageRequest): Promise<MessageResponse> => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { user_id, message_id, delivered_at, seen_at } = requestData;

  const messageBelongsToUser = await prisma.message.findFirst({
    where: {
      messageId: message_id
    },
    include: {
      group: {
        select: {
          authorId: true,
          participantId: true
        }
      }
    }
  });

  if (!messageBelongsToUser) {
    throw new Error('Message does not exist');
  }

  if (messageBelongsToUser.group.authorId !== user_id &&
      messageBelongsToUser.group.participantId !== user_id) {
    throw new Error('Message does not belong to the user');
  }
  return await prisma.$transaction(async (tx) => {
    const messageExist = await tx.messageDelivery.findFirst({
      where: {
        messageId: message_id
      }
    });

    if (!messageExist) {
      throw new Error('Message Id Does not exist');
    }

    const updateData: any = {};

    if (delivered_at && !messageExist.deliveredAt) {
      updateData.deliveredAt = new Date(delivered_at);
    }

    if (seen_at && !messageExist.seenAt) {
      updateData.seenAt = new Date(seen_at);
    }

    const updatedDelivery = await tx.messageDelivery.update({
      where: {
        messageId: message_id
      },
      data: updateData
    });

    const message = await tx.message.findUnique({
      where: {
        messageId: message_id
      }
    });

    if (!message) {
      throw new Error('Message not found');
    }

    return {
      message_id: message.messageId,
      group_id: Number(message.groupId),
      sender_id: message.senderId,
      content: message.content,
      content_type: message.messageType || 'TEXT',
      content_url: message.mediaUrl,
      sent_at: message.createdAt.toISOString(),
      delivered_at: updatedDelivery.deliveredAt ? updatedDelivery.deliveredAt.toISOString() : null,
      seen_at: updatedDelivery.seenAt ? updatedDelivery.seenAt.toISOString() : null,
      call: null,
      delivery_status: getDeliveryStatus(updatedDelivery.deliveredAt, updatedDelivery.seenAt)
    };
  });
};
