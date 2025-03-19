import { type Request, type Response } from 'express';

import responseUtils from '@utils/response.utils';
import authUtils from '@utils/auth.utils';

import { type ILinkedinAccessTokenResponse } from '@/resources/auth.resource';
import { getAuthUserByUUID, upsertAuthUser } from '@/database/repositories/AuthUser';
import { generateToken } from '@/utils/jwt.utils';

const token = async (req: Request, res: Response): Promise<void> => {
  const startTime = performance.now(); // Start timer for the whole function

  const { authCode, redirectURI } = req.body as {
    authCode: string
    redirectURI: string
  };

  const linkedinAccessTokenStartTime = performance.now();
  const authData: ILinkedinAccessTokenResponse | null = await authUtils.linkedinAccessToken(authCode, redirectURI);
  const linkedinAccessTokenEndTime = performance.now();
  console.log(`linkedinAccessToken took: ${linkedinAccessTokenEndTime - linkedinAccessTokenStartTime}ms`);

  if (!authData) {
    throw new Error('Invalid user');
  }

  const upsertAuthUserStartTime = performance.now();
  const authUser = await upsertAuthUser(authData);
  const upsertAuthUserEndTime = performance.now();
  console.log(`upsertAuthUser took: ${upsertAuthUserEndTime - upsertAuthUserStartTime}ms`);

  if (!authUser) {
    throw new Error('Invalid user');
  }

  const generateTokenStartTime = performance.now();
  const tokenValue = generateToken(authUser.authUserId);
  const generateTokenEndTime = performance.now();
  console.log(`generateToken took: ${generateTokenEndTime - generateTokenStartTime}ms`);

  const responseUtilsStartTime = performance.now();
  responseUtils.success(res, { token: tokenValue, status: authUser.status, firstName: authUser.firstName, lastName: authUser.lastName });
  const responseUtilsEndTime = performance.now();
  console.log(`responseUtils.success took: ${responseUtilsEndTime - responseUtilsStartTime}ms`);

  const endTime = performance.now(); // End timer for the whole function
  console.log(`token function took: ${endTime - startTime}ms`);
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
