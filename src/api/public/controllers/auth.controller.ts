import { type Request, type Response } from 'express';

import responseUtils from '@utils/response.utils';
import authUtils from '@utils/auth.utils';

import { type ILinkedinAccessTokenResponse } from '@/resources/auth.resource';
import { getAuthUserByUUID, upsertAuthUser } from '@/database/repositories/AuthUser';
import { generateToken } from '@/utils/jwt.utils';

const token = async (req: Request, res: Response): Promise<void> => {
  const { authCode, redirectURI } = req.body as {
    authCode: string
    redirectURI: string
  };

  const authData: ILinkedinAccessTokenResponse | null = await authUtils.linkedinAccessToken(authCode, redirectURI);
  if (!authData) {
    throw new Error('Invalid user');
  }

  const authUser = await upsertAuthUser(authData);
  if (!authUser) {
    throw new Error('Invalid user');
  }

  const token = generateToken(authUser.authUserId);

  responseUtils.success(res, { token, status: authUser.status, firstName: authUser.firstName, lastName: authUser.lastName });
};

const status = async (req: Request, res: Response): Promise<void> => {
  const authUserId = req.authUserId;
  const authUser = await getAuthUserByUUID(authUserId);
  responseUtils.success(res, { status: authUser?.status });
};

export default {
  token,
  status
};
