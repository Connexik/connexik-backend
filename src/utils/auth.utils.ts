import axios from 'axios';
import config from '@/config';
import { type ILinkedinAccessTokenResponse } from '@/resources/auth.resource';

const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const USER_INFO_URL = 'https://api.linkedin.com/v2/userinfo';

const CLIENT_SECRET = config.linkedin_client_secret;
const CLIENT_ID = config.linkedin_client_id;

interface ILinkedinAccessToken {
  access_token: string
  expires_in: number
}

interface ILinkedinUserInfo {
  sub: string
  email: string
  email_verified: boolean
  given_name: string
  family_name: string
}

const linkedinAccessToken = async (authCode: string, redirectUri: string): Promise<ILinkedinAccessTokenResponse | null> => {
  try {
    const accesTokenResponse = await axios.post<ILinkedinAccessToken>(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    if (accesTokenResponse.status !== 200) {
      return null;
    }
    const accessToken = accesTokenResponse.data?.access_token;
    if (!accessToken) {
      return null;
    }

    const userInfoResponse = await axios.get<ILinkedinUserInfo>(USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (userInfoResponse.status !== 200) {
      return null;
    }

    const userInfo = userInfoResponse.data;
    if (!userInfo) {
      return null;
    }

    return {
      sub: userInfo.sub,
      email: userInfo.email,
      emailVerified: userInfo.email_verified,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name
    };
  } catch (error) {
    return null;
  }
}

export default {
  linkedinAccessToken
}
