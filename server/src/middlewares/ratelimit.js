import ratelimit from 'koa-ratelimit';

const db = new Map();

export default () => {
  return ratelimit({
    driver: 'memory',
    db: db,
    duration: 60000,
    errorMessage: {
      code: 0,
      data: null,
      errorMsg: '您的操作频率太快了，休息下吧～',
    },
    id: (ctx) => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total',
    },
    max: 100,
    disableHeader: false,
    whitelist: () => {
      // some logic that returns a boolean
    },
    blacklist: () => {
      // some logic that returns a boolean
    },
  });
};
