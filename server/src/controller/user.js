import axios from 'axios';
import {createRes} from '../lib/index.js';
import {SESSION_ID_NAME, SSO} from '../config/index.js';

export default class UserCtl {
  /**
   * 查询身份信息
   * @param {Object} ctx
   */
  static async info(ctx) {
    ctx.body = createRes.success(ctx.user);
  }

  /**
   * 退出登录
   * @param {Object} ctx
   */
  static async logout(ctx) {
    const sessionId = ctx.cookies.get(SESSION_ID_NAME);
    const callbackUrl = ctx.request.header.referer;
    const response = await axios.post(`${SSO.host}/api/business/logout`, {
      sessionId,
      callbackUrl,
      appId: SSO.appId,
      appSecret: SSO.appSecret,
    });
    const {code, data, message} = response.data;
    if (code === 0) {
      ctx.body = createRes.error('', 10010, data);
      return;
    }
    ctx.body = createRes.error(message || '未知错误');
  }

  /**
   * 检索用户列表
   * @param {Object} ctx
   */
  static async search(ctx) {
    const {kw} = ctx.request.query;

    if (!kw) {
      ctx.body = createRes.success([]);
      return;
    }

    const sessionId = ctx.cookies.get(SESSION_ID_NAME);
    const response = await axios.post(`${SSO.host}/api/business/search_user`, {
      key: kw,
      sessionId,
      appId: SSO.appId,
      appSecret: SSO.appSecret,
    });
    const {code, data, message} = response.data;

    if (code !== 0) {
      ctx.body = createRes.error(message);
      return;
    }

    ctx.body = createRes.success(data);
  }
}
