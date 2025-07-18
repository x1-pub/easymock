import chalk from 'chalk';
import {createRes} from '../lib/index.js';
import {UserProxyError} from '../lib/error.js';
const isDev = process.env.NODE_ENV === 'development';

export default () => {
  return async (ctx, next) => {
    const time = new Date().toISOString();

    try {
      await next();
      console.log(chalk.green(`[${time}] ${ctx.method} ${ctx.request.url}`));
    } catch (error) {
      if (isDev) {
        console.log(error);
      }
      if (error instanceof UserProxyError) {
        ctx.status = error.code;
        ctx.body = error.message;
      } else {
        const msg = error.message || error.msg || error.toString();
        ctx.body = createRes.error(msg);
      }
      console.log(chalk.red(`[${time}] [ERROR] ${ctx.method} ${ctx.request.url}`));
    }
  };
};

