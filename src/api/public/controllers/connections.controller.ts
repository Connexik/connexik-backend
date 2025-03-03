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
import { type Invitations } from '@/resources/connection.resource';

const acceptFilter = async (req: Request, res: Response): Promise<void> => {
  const { pendingInvitations, filters, connexikId } = req.body as {
    pendingInvitations: Invitations[]
    filters: string[]
    connexikId: string
  };

  const userData = await userService.getUserInfo(connexikId);
  if (!userData) {
    throw Error('connexikId not registered!');
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

  const filterInvitations = pendingInvitations.slice(
    0,
    allowedInvitations
  );

  const relevantUsers = await connectionsService.processAcceptFilters(
    userDetail,
    filterInvitations,
    filters,
    actionSummary
  );

  responseUtils.success(res, {
    remainingFilterationCount:
      allowedInvitations - filterInvitations.length,
    resetTime: moment().add(1, 'days').startOf('day').toISOString(),
    relevantUsers
  });
};

const growFilter = async (req: Request, res: Response): Promise<void> => {
  const { connections, filter, connexikId } = req.body as {
    connections: Invitations[]
    filter: string
    connexikId: string
  };

  const userData = await userService.getUserInfo(connexikId);
  if (!userData) {
    throw Error('connexikId not registered!');
  }

  const linkedInUserId = userData.id;

  const actionSummary = await connectionsService.getActionSummary(
    linkedInUserId,
    CONNECTIONS_ACTION.grow
  );
  if (
    actionSummary?.actionCount >=
    CONNECTIONS_MAX_THRESHOLD_PER_DAY[CONNECTIONS_ACTION.grow]
  ) {
    throw Error('Your per day grow connections limit exceeded!');
  }

  const userDetail: GetLinkedInUserData =
    await userService.getUserInfoData(linkedInUserId);
  if (!userDetail) {
    throw Error('You need to scan the profile first!');
  }

  const growInvitations =
    CONNECTIONS_MAX_THRESHOLD_PER_DAY[CONNECTIONS_ACTION.grow] -
    (actionSummary?.actionCount || 0);

  const filterGrowInvitations = connections.slice(
    0,
    growInvitations
  );

  const relevantUsers = await connectionsService.processGrowFilters(
    userDetail,
    filterGrowInvitations,
    filter,
    actionSummary
  );

  responseUtils.success(res, {
    relevantUsers
  });
};

const growConnectionsCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { connexikId } = req.query as { connexikId: string };
  const userData = await userService.getUserInfo(connexikId);
  if (!userData) {
    throw Error('connexikId not registered!');
  }

  const linkedInUserId = userData.id;

  const actionSummary = await connectionsService.getActionSummary(
    linkedInUserId,
    CONNECTIONS_ACTION.grow
  );

  const remainingCount =
    CONNECTIONS_MAX_THRESHOLD_PER_DAY[CONNECTIONS_ACTION.accept] -
    (actionSummary?.actionCount || 0);
  responseUtils.success(res, {
    remaining: remainingCount < 0 ? 0 : remainingCount
  });
};

export default {
  acceptFilter,
  growFilter,
  growConnectionsCount
};
