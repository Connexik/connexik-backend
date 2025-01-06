/* eslint-disable @stylistic/js/indent */
import axios, { type AxiosResponse } from 'axios';
import prisma from '@database/connection/data-source';
import { getMessageStatus } from '@services/helper.service';
import { type GroupResponse, type PaginationParams } from '@database/interface';
import config from '@config/index'

export const getAllUserGroups = async (
  userId: number,
  { page = 1, limit = 10 }: PaginationParams = {}
): Promise<GroupResponse | GroupResponse[]> => {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(100, Math.max(1, limit));
  const offset = (validPage - 1) * validLimit;

  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { authorId: userId },
        { participantId: userId }
      ],
      status: 'ACTIVE'
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          messageId: true,
          senderId: true,
          content: true,
          messageType: true,
          mediaUrl: true,
          createdAt: true,
          deliveries: {
            select: {
              deliveredAt: true,
              seenAt: true
            },
            take: 1
          }
        },
        take: 1
      }
    },
    orderBy: {
      updatedAt: 'desc'
    },
    skip: offset,
    take: validLimit
  });

  return await getFormattedGroupData(groups, userId, false);
};

export const getGroupByGroupId = async (groupId: number, userId: number): Promise<GroupResponse | GroupResponse[]> => {
  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      status: 'ACTIVE'
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          messageId: true,
          senderId: true,
          content: true,
          messageType: true,
          mediaUrl: true,
          createdAt: true,
          deliveries: {
            select: {
              deliveredAt: true,
              seenAt: true
            },
            take: 1
          }
        },
        take: 1
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return await getFormattedGroupData(group, userId, true);
};

const getFormattedGroupData = async (groups: any, userId: number, createGroup: boolean): Promise<GroupResponse | GroupResponse[]> => {
  const groupArray = Array.isArray(groups) ? groups : [groups];

  const unreadCounts = await Promise.all(
    groupArray.map(async (group) => {
      const count = await prisma.message.count({
        where: {
          groupId: group.id,
          senderId: { not: userId },
          deliveries: {
            none: {
              OR: [{ deliveredAt: { not: null } }, { seenAt: { not: null } }]
            }
          }
        }
      });
      return { groupId: group.id, unreadCount: count };
    })
  );

  const formattedGroups = await Promise.all(groupArray.map(async group => {
    let otherUserId
    if (group.authorId === userId) {
      otherUserId = group.participantId
    } else if (group.participantId === userId) {
      otherUserId = group.authorId;
    }
    const senderResponse = await axios.get<AxiosResponse>(
        `${config.uriConfig.accountMs.URI}/user/private/v1/user-info?user_id=${otherUserId}`
    );

    const sender = senderResponse.data.data;

    const senderData = {
      user_id: sender.user_id,
      status: sender.status,
      online: sender.online,
      fname: sender.fname,
      role: sender.role || null,
      profile_image_url: sender.profile_image_url
    }
    const latestMessage = group.messages[0];
    const unreadCount = unreadCounts.find((uc) => uc.groupId === group.id)?.unreadCount || 0;

    return {
      group_id: Number(group.id),
      click_action: 'active',
      latest_message: latestMessage
        ? {
            message_id: latestMessage.messageId,
            sender_id: latestMessage.senderId,
            message_status: getMessageStatus(latestMessage.messageType as string, latestMessage.content as string),
            content: latestMessage.content,
            content_type: latestMessage.messageType || 'TEXT',
            sent_at: latestMessage.createdAt.toISOString(),
            delivered_at: latestMessage.deliveries[0]?.deliveredAt?.toISOString() || null,
            seen_at: latestMessage.deliveries[0]?.seenAt?.toISOString() || null
          }
        : null,
      other_user: senderData,
      meta_data: {
        unread_count: unreadCount,
        favourite: false
      }
    };
  }));

  return createGroup ? formattedGroups[0] : formattedGroups;
};
