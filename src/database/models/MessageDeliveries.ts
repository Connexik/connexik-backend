import { type MessageDelivery as PrismaMessageDelivery } from '@prisma/client'

export class MessageDelivery {
  id: bigint;
  messageId: string;
  deliveredAt: Date | null;
  seenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor (delivery: PrismaMessageDelivery) {
    this.id = delivery.id;
    this.messageId = delivery.messageId;
    this.deliveredAt = delivery.deliveredAt;
    this.seenAt = delivery.seenAt;
    this.createdAt = delivery.createdAt;
    this.updatedAt = delivery.updatedAt;
  }
}
