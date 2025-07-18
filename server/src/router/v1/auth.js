import Router from '@koa/router';
import AuthCtl from '../../controller/auth.js';

const router = new Router();

router.get('/ticket', AuthCtl.ticket);

export default router;
