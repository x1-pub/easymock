import doraemon from '../../doraemon.js'

const { test, prod } = doraemon
const isDev = process.env.NODE_ENV === 'development';

export const PORT = 9907;

export const MONGODB_CONNECT_KEY = isDev ? test.mongo : prod.mongo;

export const SSO = {
  host: 'https://sso.x1.pub',
  appId: isDev ? test.ssoAppId : prod.ssoAppId,
  appSecret: isDev ? test.ssoAppSecret : prod.ssoAppSecret,
};

export const SESSION_ID_NAME = 'easy_mock_session';
