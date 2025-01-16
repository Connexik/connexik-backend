import _ from 'lodash';

import {
  CONNECTIONS_ACTION,
  CONNECTIONS_ACTION_TYPE,
  CONNECTIONS_FILTERS
} from '@/config/constants/connections.constants';
import {
  createLinkedInActionSummary,
  getLinkedInActionSummary,
  updateLinkedInActionSummary
} from '@/database/repositories/LinkedInActionsSummary';
import {
  type LLMRelevantUsers,
  type CreateLinkedInFiltersRequestData,
  type LinkedinActionSummaryBasic,
  type PendingInvitations
} from '@/resources/connection.resource';
import {
  type GetLinkedInUserData,
  type PartialGetLinkedInUserData
} from '@/resources/user.resource';
import geminiUtils from '@/utils/gemini.utils';
import { createLinkedInFiltersRequest } from '@/database/repositories/LinkedInFiltersRequest';
import { createBatchLinkedInFiltersRequestData } from '@/database/repositories/LinkedInFiltersRequestData';

const getActionSummary = async (
  linkedInUserId: number,
  action: string
): Promise<LinkedinActionSummaryBasic | null> => {
  return await getLinkedInActionSummary(linkedInUserId, action);
};

const processAcceptFilters = async (
  linkedInUserData: GetLinkedInUserData,
  pendingInvites: PendingInvitations[],
  filters: string[],
  actionSummary: LinkedinActionSummaryBasic
): Promise<LLMRelevantUsers[]> => {
  const requestId = await createLinkedInFiltersRequest(
    linkedInUserData.linkedInUserId,
    CONNECTIONS_ACTION.accept,
    CONNECTIONS_ACTION_TYPE.basic_details,
    filters
  );

  if (!requestId) {
    throw Error('Some error occurred! We are looking into it.');
  }

  let userData: PartialGetLinkedInUserData = {};

  /* eslint-disable @stylistic/js/indent */
  const filterPrompt = filters
    .map((filter: string) => {
      switch (filter) {
        case 'company': {
          userData.experience = linkedInUserData.experience;
          return CONNECTIONS_FILTERS[filter];
        }
        case 'school': {
          userData.education = linkedInUserData.education;
          return CONNECTIONS_FILTERS[filter];
        }
        case 'mutualConnections': {
          return CONNECTIONS_FILTERS[filter];
        }
        case 'ai': {
          userData = linkedInUserData;
          return CONNECTIONS_FILTERS[filter];
        }
        default: {
          return filter;
        }
      }
    })
    .join('\n');
  /* eslint-enable @stylistic/js/indent */

  let userDataPrompt = '';
  if (!_.isEmpty(userData)) {
    userDataPrompt = JSON.stringify(userData);
  }

  const { usageMetadata, data: relevantUsers } =
    await geminiUtils.generateReleventUsers(
      filterPrompt,
      userDataPrompt,
      JSON.stringify(
        pendingInvites.map((invite) => ({
          username: invite.username,
          title: invite.title,
          memberInsights: invite.memberInsights
        }))
      )
    );

  console.log('Usage Metadata = ', usageMetadata);

  const pendingInvitesObj: Record<string, PendingInvitations> =
    pendingInvites.reduce<Record<string, PendingInvitations>>(
      (data, invite) => {
        data[invite.username] = invite;
        return data;
      },
      {}
    );

  const insertBatch: CreateLinkedInFiltersRequestData[] = relevantUsers.map(
    (user) => ({
      linkedInFiltersRequestId: requestId,
      username: user.username,
      fullName: pendingInvitesObj[user.username].fullName,
      title: pendingInvitesObj[user.username].title,
      memberInsights: pendingInvitesObj[user.username].memberInsights,
      aiDecision: user.status,
      aiReason: user.reason,
      aiConfidence: user.confidence
    })
  );

  await createBatchLinkedInFiltersRequestData(insertBatch);

  if (!actionSummary) {
    await createLinkedInActionSummary(
      linkedInUserData.linkedInUserId,
      pendingInvites.length,
      CONNECTIONS_ACTION.accept
    );
  } else {
    await updateLinkedInActionSummary(
      actionSummary.linkedInActionSummaryId,
      pendingInvites.length
    );
  }

  return relevantUsers;
};

export default {
  getActionSummary,
  processAcceptFilters
};
