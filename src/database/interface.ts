export interface Message {
  id: bigint
  messageId: string
  groupId: bigint
  senderId: number
  content: string
  messageType?: string
  mediaUrl?: string | null
  createdAt: Date
  updatedAt: Date
  group?: Group
  deliveries?: MessageDelivery[]
}

export interface CallInfo {
  title: string
  status: string
  call_id: string
  call_started_at: string
  call_ended_at: string | null
}

export interface Group {
  id: bigint
  status: string | null
  authorId: number
  participantId: number
  latestMessageId: string | null
  createdAt: Date
  updatedAt: Date
  messages?: Message[]
}

export interface GetMessage {
  message_id: string
  group_id: number
  sender_id: number
  content: string
  content_type: string
  content_url: string | null
  sent_at: string
  delivered_at: string | null
  seen_at: string | null
  call: CallInfo | null
  delivery_status: 'SENT' | 'DELIVERED' | 'SEEN'
}

export interface SendMessageRequest {
  message_id: string
  content: string
  content_type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'VIDEO_CALL' | 'VOICE_CALL'
  content_url?: string
  group_id?: number
  sender_id?: number
}

export interface UpdateMessageRequest {
  user_id: number
  message_id: string
  delivered_at?: Date
  seen_at?: Date
}

export interface MessageResponse {
  message_id: string
  group_id: number
  sender_id: number
  content: string
  content_type: string
  content_url: string | null
  sent_at: string
  delivered_at: string | null
  seen_at: string | null
  call: CallInfo | null
  delivery_status: 'SENT' | 'DELIVERED' | 'SEEN'
}

export interface CreateGroupRequest {
  name?: string
  authorId: number
  participantId: number
  status?: string
}

interface MessageDelivery {
  id: bigint
  messageId: string
  deliveredAt?: Date
  seenAt?: Date
  createdAt: Date
  updatedAt: Date
  message?: Message
}

export interface CreateMessageRequest {
  messageId?: string
  groupId: number
  senderId: number
  content: string
  messageType?: string
  mediaUrl?: string
}

export interface MessageDeliveryResponse {
  id: number
  messageId: string
  deliveredAt?: string // ISO string format
  seenAt?: string // ISO string format
  createdAt: string // ISO string format
  updatedAt: string // ISO string format
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  VOICE = 'VOICE',
  VIDEO_CALL = 'VIDEO_CALL',
  VOICE_CALL = 'VOICE_CALL'
}

interface MessageWithoutRelations {
  content: string
  messageType: string | null
  createdAt: Date
  senderId: number
}

// Type for Prisma response with included relations
export interface GroupWithIncludes {
  id: bigint
  name: string | null
  status: string | null
  authorId: number
  participantId: number
  latestMessageId: string | null
  createdAt: Date
  updatedAt: Date
  messages: MessageWithoutRelations[]
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface Sender {
  user_id: number
  status: string
  online: boolean
  fname: string
  role: string
  profile_image_url: string
}

interface MetaData {
  unread_count?: number
  favourite?: boolean
}
export interface GroupResponse {
  group_id: number
  click_action: string
  latest_message: LatestMessage | null
  other_user: Sender
  meta_data: MetaData
}

export interface PaginatedGroupResponse {
  groups: GroupResponse[]
  metadata: {
    currentPage: number
    totalPages: number
    totalGroups: number
    hasMore: boolean
  }
}

export interface LatestMessage {
  message_id: string
  sender_id: number
  message_status: string | null
  content: string
  content_type: string
  sent_at: string
  delivered_at: string | null
  seen_at: string | null
}
