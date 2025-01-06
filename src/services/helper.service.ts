import prisma from '@database/connection/data-source';
import { type CallInfo, type Group } from '@database/interface'

export const getDeliveryStatus = (deliveredAt: Date | null, seenAt: Date | null): 'SENT' | 'DELIVERED' | 'SEEN' => {
  if (seenAt) return 'SEEN';
  if (deliveredAt) return 'DELIVERED';
  return 'SENT';
};

export const parseCallInfo = (content: string, messageType: string, messageId: string): CallInfo | null => {
  if (!messageType.includes('CALL')) return null;

  const isEnded = content.toLowerCase().includes('ended');
  const isMissed = content.toLowerCase().includes('missed');

  return {
    title: content,
    status: isMissed ? 'MISSED' : isEnded ? 'ENDED' : 'ONGOING',
    call_id: messageId,
    call_started_at: new Date().toISOString(),
    call_ended_at: isEnded ? new Date().toISOString() : null
  };
};

export const generateMessageId = (): string => {
  return crypto.randomUUID();
};

export const findExistingGroup = async (
  authorId: number,
  participantId: number
): Promise<Group | null> => {
  return await prisma.group.findFirst({
    where: {
      AND: [
        {
          OR: [
            { authorId, participantId },
            { authorId: participantId, participantId: authorId }
          ]
        },
        { status: 'ACTIVE' }
      ]
    }
  });
};

export const createNewGroup = async (authorId: number, participantId: number): Promise<Group> => {
  const existingGroup = await prisma.group.findFirst({
    where: {
      OR: [
        { authorId, participantId },
        { authorId: participantId, participantId: authorId }
      ],
      status: 'ACTIVE'
    }
  });

  if (existingGroup) {
    return existingGroup;
  }

  return await prisma.group.create({
    data: {
      authorId,
      participantId,
      status: 'ACTIVE',
      name: `Group-${authorId}-${participantId}`
    }
  });
};

// Helper function to determine message status based on type and content
export const getMessageStatus = (messageType: string | null, content: string): string | null => {
  if (messageType === 'VIDEO_CALL' || messageType === 'VOICE_CALL') {
    if (content.toLowerCase().includes('missed')) {
      return 'MISSED';
    }
    if (content.toLowerCase().includes('ended')) {
      return 'ENDED';
    }
  }
  return null;
};
