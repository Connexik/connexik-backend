import { type Message as PrismaMessage } from '@prisma/client';

export class Message {
  id: bigint;
  messageId: string;
  groupId: bigint;
  senderId: number;
  content: string;
  messageType: string | null;
  mediaUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor (message: PrismaMessage) {
    this.id = message.id;
    this.messageId = message.messageId;
    this.groupId = message.groupId;
    this.senderId = message.senderId;
    this.content = message.content;
    this.messageType = message.messageType;
    this.mediaUrl = message.mediaUrl;
    this.createdAt = message.createdAt;
    this.updatedAt = message.updatedAt;
  }
}
