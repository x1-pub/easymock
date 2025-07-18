import axios from 'axios';

import {SSO, SESSION_ID_NAME} from '../config/index.js';

export default class AuthCtl {
  static async ticket(ctx) {
    const {ticket, callbackUrl} = ctx.query;
    const {data} = await axios.post(`${SSO.host}/api/business/auth/ticket`, {
      ticket,
      appId: SSO.appId,
      appSecret: SSO.appSecret,
    });
    if (data.code === 0) {
      ctx.cookies.set(SESSION_ID_NAME, data.data.sessionId, {
        maxAge: 1000 * 60 * 60 * 24,
      });
      ctx.redirect(callbackUrl);
    }
    ctx.body = {code: 0};
  }
}
