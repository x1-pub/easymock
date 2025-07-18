import Router from '@koa/router';
import UserCtl from '../../controller/user.js';

const router = new Router();

router.get('/userinfo', UserCtl.info);
router.post('/logout', UserCtl.logout);
router.get('/search', UserCtl.search);

export default router;
