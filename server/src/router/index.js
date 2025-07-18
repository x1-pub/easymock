import Router from '@koa/router';
import v1 from './v1//index.js';
import proxy from './proxy/index.js';

const router = new Router();

router
    .use('/api/v1', v1.routes())
    .use('/user-http-proxy', proxy.routes());

export default router;
