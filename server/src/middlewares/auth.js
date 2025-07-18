import axios from 'axios';
import {createRes} from '../lib/index.js';
import {SSO, SESSION_ID_NAME} from '../config/index.js';

export default () => {
  return async (ctx, next) => {
    const apiWhiteList = [
      '/user-http-proxy',
      '/api/v1/auth/ticket',
    ];
    const url = ctx.request.url;
    const inWhiteList = apiWhiteList.some((uri) => url.includes(uri));

    if (!inWhiteList) {
      const sessionId = ctx.cookies.get(SESSION_ID_NAME);
      const callbackUrl = ctx.request.header.referer;

      const {data} = await axios.post(`${SSO.host}/api/business/auth/session`, {
        sessionId,
        appId: SSO.appId,
        appSecret: SSO.appSecret,
        callbackUrl,
      });
      if (data.code !== 0) {
        ctx.body = createRes.error(data.message, data.code, data.data);
        return;
      }
      ctx.user = data.data;
    }

    await next();
  };
};

