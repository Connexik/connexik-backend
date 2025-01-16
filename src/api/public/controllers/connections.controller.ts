import { type Request, type Response } from 'express';
import moment from 'moment';

import userService from '../../../services/user.service';

import responseUtils from '@utils/response.utils';
import { type GetLinkedInUserData } from '@/resources/user.resource';
import connectionsService from '@/services/connections.service';
import {
  CONNECTIONS_ACTION,
  CONNECTIONS_MAX_THRESHOLD_PER_DAY
} from '@/config/constants/connections.constants';
import { type PendingInvitations } from '@/resources/connection.resource';

const acceptFilter = async (req: Request, res: Response): Promise<void> => {
  const { pendingInvitations, filters, convexikId } = req.body as {
    pendingInvitations: PendingInvitations[]
    filters: string[]
    convexikId: string
  };

  const userData = await userService.getUserInfo(convexikId);
  if (!userData) {
    throw Error('ConvexikId not registered!');
  }

  const linkedInUserId = userData.id;

  const actionSummary = await connectionsService.getActionSummary(
    linkedInUserId,
    CONNECTIONS_ACTION.accept
  );
  if (
    actionSummary?.actionCount >=
    CONNECTIONS_MAX_THRESHOLD_PER_DAY[CONNECTIONS_ACTION.accept]
  ) {
    throw Error('Your per day accept connections limit exceeded!');
  }

  const userDetail: GetLinkedInUserData =
    await userService.getUserInfoData(linkedInUserId);
  if (!userDetail) {
    throw Error('You need to scan the profile first!');
  }

  const allowedInvitations =
    CONNECTIONS_MAX_THRESHOLD_PER_DAY[CONNECTIONS_ACTION.accept] -
    (actionSummary?.actionCount || 0);

  const filterPendingInvitations = pendingInvitations.slice(
    0,
    allowedInvitations
  );

  const relevantUsers = await connectionsService.processAcceptFilters(
    userDetail,
    filterPendingInvitations,
    filters,
    actionSummary
  );

  responseUtils.success(res, {
    remainingFilterationCount:
      allowedInvitations - filterPendingInvitations.length,
    resetTime: moment().add(1, 'days').startOf('day'),
    relevantUsers
  });
};

export default {
  acceptFilter
};
