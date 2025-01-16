export interface LinkedinActionSummaryBasic {
  linkedInActionSummaryId: number
  linkedInUserId: number
  action: string
  actionDate: Date
  actionCount: number
}

export interface PendingInvitations {
  username: string
  fullName: string
  title: string
  memberInsights: string
}

export interface LLMRelevantUsers {
  username: string
  reason: string
  status: string
  confidence: number
}

export interface CreateLinkedInFiltersRequestData {
  linkedInFiltersRequestId: number // Corresponds to "linkedin_filters_request_id"
  username: string
  fullName: string // Corresponds to "full_name"
  title: string
  memberInsights: string // Corresponds to "member_insights"
  aiDecision: string // Corresponds to "ai_decision"
  aiReason: string // Corresponds to "ai_reason"
  aiConfidence: number // Corresponds to "ai_confidence"
}
