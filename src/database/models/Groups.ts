import { type Group as PrismaGroups } from '@prisma/client';

export class Group {
  id: bigint;
  name: string | null;
  status: string | null;
  authorId: number;
  participantId: number;
  latestMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor (group: PrismaGroups) {
    this.id = group.id;
    this.name = group.name;
    this.status = group.status;
    this.authorId = group.authorId;
    this.participantId = group.participantId;
    this.latestMessageId = group.latestMessageId;
    this.createdAt = group.createdAt;
    this.updatedAt = group.updatedAt;
  }
}
